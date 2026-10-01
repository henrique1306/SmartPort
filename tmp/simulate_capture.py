import sqlite3
from datetime import datetime

# Simular captura de veículo LIBERADO
conn = sqlite3.connect("database.db")
conn.row_factory = sqlite3.Row

# Veículo ABC1234 (agora BLOQUEADO conforme teste anterior)
placa = "ABC1234"
timestamp = datetime.now().isoformat()

cursor = conn.execute("SELECT * FROM veiculos_autorizados WHERE placa = ?", (placa,))
veiculo = cursor.fetchone()

# Mesmo que bloqueado, inserir o registro
autorizado = veiculo is not None and veiculo["autorizado"]
nome = veiculo["nome_condutor"] if veiculo else "Desconhecido"

conn.execute("""
    INSERT INTO pending_records (timestamp, placa, nome, autorizado, foto_blob) 
    VALUES (?, ?, ?, ?, ?)
""", (timestamp, placa, nome, int(autorizado), b'dummy'))
conn.commit()

print(f"[OK] Simulado acesso de {placa} - Autorizado: {bool(autorizado)}")

# Listar todos os registros
cursor = conn.execute("SELECT * FROM pending_records")
for row in cursor.fetchall():
    print(f"  Placa: {row['placa']} | Nome: {row['nome']} | Autorizado: {row['autorizado']}")

conn.close()
