import sys
sys.path.insert(0, '/app/shared')

import glob
import json
import sqlite3
import threading
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Response
from pydantic import BaseModel
from typing import List, Optional

# Importações de módulos compartilhados e autenticação
from offline_repository import OfflineBufferRepository
from rabbitmq_utils import RabbitMqManager
from auth import router as auth_router, get_current_user, get_db

app = FastAPI(title="Service Camera", version="1.0.0")
app.include_router(auth_router)

# Modelos Pydantic
class ConfigUpdate(BaseModel):
    modo_operacao: str  # Ex: "AUTOMATICO", "MANUAL"

class Veiculo(BaseModel):
    placa: str
    nome_condutor: str
    autorizado: bool = True

class VeiculoUpdate(BaseModel):
    placa: str | None = None
    nome_condutor: str | None = None
    autorizado: bool | None = None

# Inicialização de Banco de Dados de Domínio (SQLite Local mock)
def init_domain_db():
    with sqlite3.connect("database.db") as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                modo_operacao TEXT NOT NULL DEFAULT 'MANUAL'
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS veiculos_autorizados (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                placa TEXT UNIQUE NOT NULL,
                nome_condutor TEXT NOT NULL,
                autorizado BOOLEAN NOT NULL DEFAULT 1
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS pending_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                placa TEXT NOT NULL,
                nome TEXT,
                autorizado BOOLEAN NOT NULL,
                foto_blob BLOB
            )
        """)
        # Inserir config padrão se não existir
        conn.execute("INSERT OR IGNORE INTO config (id, modo_operacao) VALUES (1, 'AUTOMATICO')")
        conn.commit()

init_domain_db()

# ==========================================
# RABBITMQ CONSUMER (Thread em Background)
# ==========================================
def process_automatic_capture():
    """Lógica acionada quando o hardware_events envia CAPTURE_TRIGGER"""
    print("[Camera] Simulando captura e leitura OCR...")
    placa_detectada = "ABC1234"  # Simulação de OCR. Em produção, viria de lib de visão.
    foto_blob = b'\xff\xd8\xff\xe0\x00\x10JFIF' # Dummy JPEG BLOB
    
    with sqlite3.connect("database.db") as conn:
        conn.row_factory = sqlite3.Row
        
        # 1. Consulta SQL explícita contra veículos autorizados (NUNCA hardcoded)
        cursor_veiculo = conn.execute("SELECT * FROM veiculos_autorizados WHERE placa = ?", (placa_detectada,))
        veiculo = cursor_veiculo.fetchone()
        
        # Verificar se veículo existe E está autorizado
        autorizado = veiculo is not None and veiculo["autorizado"]
        nome = veiculo["nome_condutor"] if veiculo else "Desconhecido"
        
        # 2. Gravar no buffer offline (pending_records)
        timestamp = datetime.now().isoformat()
        buffer_repo = OfflineBufferRepository() # Sem injeção, usa path padrão
        # Ou inserção direta caso o buffer repo seja um wrapper abstrato
        conn.execute("""
            INSERT INTO pending_records (timestamp, placa, nome, autorizado, foto_blob) 
            VALUES (?, ?, ?, ?, ?)
        """, (timestamp, placa_detectada, nome, autorizado, foto_blob))
        conn.commit()
        
        # 3. Verifica regra de negócio para comando de hardware
        cursor_cfg = conn.execute("SELECT modo_operacao FROM config WHERE id = 1")
        cfg = cursor_cfg.fetchone()
        
        if cfg and cfg["modo_operacao"] == "AUTOMATICO" and autorizado:
            print(f"[Camera] Veículo autorizado ({placa_detectada}). Abrindo cancela...")
            rabbit = RabbitMqManager()
            rabbit.publish(queue="hardware_commands", message={"action": "open"})

def rabbitmq_listener():
    try:
        rabbit = RabbitMqManager()
        def callback(ch, method, properties, body):
            data = json.loads(body)
            if data.get("event") == "CAPTURE_TRIGGER":
                process_automatic_capture()
        
        rabbit.consume(queue="hardware_events", callback=callback)
    except Exception as e:
        print(f"[RabbitMQ] Erro no listener em background: {e}")

@app.on_event("startup")
def startup_event():
    # Inicia a thread isolada do event loop do FastAPI
    thread = threading.Thread(target=rabbitmq_listener, daemon=True)
    thread.start()


# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "camera"}

@app.get("/api/config")
def get_config(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT modo_operacao FROM config WHERE id = 1")
    return cursor.fetchone()

@app.post("/api/config")
def update_config(config: ConfigUpdate, current_user: str = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    db.execute("UPDATE config SET modo_operacao = ? WHERE id = 1", (config.modo_operacao,))
    db.commit()
    return {"msg": "Configuração atualizada"}

@app.get("/api/devices/cameras")
def list_cameras(current_user: str = Depends(get_current_user)):
    devices = glob.glob('/dev/video*')
    return {"cameras": devices}

@app.post("/api/capture/process")
def manual_capture(current_user: str = Depends(get_current_user)):
    # Dispara manualmente o pipeline que a thread faz via hardware
    process_automatic_capture()
    return {"msg": "Captura manual iniciada e processada"}

@app.get("/api/records")
def list_records(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("""
        SELECT id, timestamp, placa, nome, autorizado 
        FROM pending_records 
        ORDER BY id DESC LIMIT 20
    """)
    return [dict(row) for row in cursor.fetchall()]

@app.get("/api/records/{record_id}/foto")
def get_record_foto(record_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT foto_blob FROM pending_records WHERE id = ?", (record_id,))
    row = cursor.fetchone()
    if not row or not row["foto_blob"]:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    return Response(content=row["foto_blob"], media_type="image/jpeg")

# ==========================================
# CRUD VEÍCULOS AUTORIZADOS
# ==========================================

@app.get("/api/veiculos_autorizados")
def list_veiculos(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT id, placa, nome_condutor, autorizado FROM veiculos_autorizados")
    return [dict(row) for row in cursor.fetchall()]

@app.post("/api/veiculos_autorizados")
def create_veiculo(veiculo: Veiculo, current_user: str = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    try:
        db.execute("INSERT INTO veiculos_autorizados (placa, nome_condutor, autorizado) VALUES (?, ?, ?)", (veiculo.placa, veiculo.nome_condutor, veiculo.autorizado))
        db.commit()
        return {"msg": "Veículo autorizado com sucesso"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Placa já cadastrada")

@app.put("/api/veiculos_autorizados/{veiculo_id}")
def update_veiculo(veiculo_id: int, veiculo: VeiculoUpdate, current_user: str = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    # Construir UPDATE dinamicamente com apenas os campos fornecidos
    updates = {}
    if veiculo.placa is not None:
        updates["placa"] = veiculo.placa
    if veiculo.nome_condutor is not None:
        updates["nome_condutor"] = veiculo.nome_condutor
    if veiculo.autorizado is not None:
        updates["autorizado"] = veiculo.autorizado
    
    if not updates:
        return {"msg": "Nenhum campo para atualizar"}
    
    set_clause = ", ".join([f"{k} = ?" for k in updates.keys()])
    values = list(updates.values()) + [veiculo_id]
    
    cursor = db.execute(f"UPDATE veiculos_autorizados SET {set_clause} WHERE id = ?", values)
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return {"msg": "Veículo atualizado"}

@app.delete("/api/veiculos_autorizados/{veiculo_id}")
def delete_veiculo(veiculo_id: int, current_user: str = Depends(get_current_user), db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("DELETE FROM veiculos_autorizados WHERE id = ?", (veiculo_id,))
    db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")
    return {"msg": "Veículo removido"}
