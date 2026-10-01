import asyncio
import sqlite3
import os
from contextlib import asynccontextmanager
from datetime import datetime
import requests
from fastapi import FastAPI

# Variáveis globais de estado para monitoramento via endpoint
sync_state = {
    "pending_items": 0,
    "internet_connected": False,
    "last_sync": None
}

class OfflineBufferRepository:
    """
    Mock do repositório para gerenciar a conexão com o banco de dados.
    Em um cenário real, isso poderia ser importado de 'shared.database'.
    """
    def __init__(self, db_path="/app/shared/data/local_buffer.db"):
        self.db_path = db_path
        # Valida se o diretório e o arquivo estão acessíveis
        if not os.path.exists(os.path.dirname(self.db_path)):
            raise FileNotFoundError(f"Diretório não encontrado: {os.path.dirname(self.db_path)}")
        self.conn = sqlite3.connect(self.db_path)

async def check_internet_connection() -> bool:
    """
    Checa a conectividade de forma assíncrona para não bloquear o event loop do FastAPI.
    """
    try:
        # requests.get é síncrono. Rodamos em uma thread separada para não travar o loop de eventos.
        response = await asyncio.to_thread(requests.get, "https://8.8.8.8", timeout=3)
        return response.status_code == 200
    except requests.RequestException:
        return False

async def sync_worker_loop():
    """
    Loop assíncrono em background. Substitui threads daemon para garantir um shutdown gracioso.
    """
    db_path = "/app/shared/data/local_buffer.db"
    
    while True:
        repo = None
        # 1. Lazy Loading da conexão com o banco de dados
        try:
            repo = OfflineBufferRepository(db_path=db_path)
        except Exception as e:
            print(f"[Syncer] Banco de dados ou diretório não prontos: {e}. Retentando em 5s...")
            await asyncio.sleep(5)
            continue
            
        try:
            cursor = repo.conn.cursor()
            
            # 2. Verifica a existência da tabela preventivamente
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='pending_records'")
            table_exists = cursor.fetchone()
            
            if table_exists:
                # 3. Contagem de itens pendentes
                cursor.execute("SELECT COUNT(*) FROM pending_records WHERE sincronizado = 0")
                pending_count = cursor.fetchone()[0]
                sync_state["pending_items"] = pending_count
                
                # 4. Checagem de conectividade com a internet
                is_connected = await check_internet_connection()
                sync_state["internet_connected"] = is_connected
                
                # 5. Processamento em Lote (Batch) se houver internet e dados
                if is_connected and pending_count > 0:
                    cursor.execute("SELECT id FROM pending_records WHERE sincronizado = 0 LIMIT 10")
                    rows = cursor.fetchall()
                    
                    if rows:
                        ids = [row[0] for row in rows]
                        
                        # (Lógica de upload para nuvem/Firebase entraria aqui)
                        print(f"[Syncer] Sincronizando {len(ids)} itens para a nuvem...")
                        
                        # 6. Marca itens como sincronizados
                        placeholders = ','.join(['?'] * len(ids))
                        cursor.execute(f"UPDATE pending_records SET sincronizado = 1 WHERE id IN ({placeholders})", ids)
                        repo.conn.commit()
                        
                        sync_state["last_sync"] = datetime.now().isoformat()
                        print(f"[Syncer] Lote sincronizado com sucesso.")
            else:
                print("[Syncer] Tabela 'pending_records' ainda não foi criada.")
                
        except Exception as e:
            print(f"[Syncer] Erro durante o ciclo de sincronização: {e}")
        finally:
            if repo and repo.conn:
                repo.conn.close()

        # 7. Aguarda 15 segundos antes de rodar o próximo ciclo, liberando a CPU
        await asyncio.sleep(15)


# A função lifespan DEVE ser declarada antes da inicialização do FastAPI para evitar NameError
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicia a task em background acoplada ao ciclo de vida da aplicação
    task = asyncio.create_task(sync_worker_loop())
    yield
    # Encerramento gracioso do Uvicorn e cancelamento da task
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(title="SmartPort - Cloud Syncer", lifespan=lifespan)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "syncer"}

@app.get("/api/sync/status")
async def sync_status():
    return sync_state