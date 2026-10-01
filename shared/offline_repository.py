import os
import sqlite3
import json
from typing import Dict, Any

class OfflineBufferRepository:
    def __init__(self, db_path: str = "/app/data/offline_buffer.db"):
        self.db_path = db_path
        
        # Prevenção de erro crítico 1: Criar o diretório pai automaticamente
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        # check_same_thread=False para permitir uso em threads diferentes de forma segura
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        
        # Diretivas de resiliência e performance essenciais
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=EXTRA;")
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Tabela: sistema_config
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sistema_config (
                    id INTEGER PRIMARY KEY,
                    dados TEXT
                )
            """)
            
            # Configuração padrão do sistema
            default_config = {
                "camera_tipo": "RTSP",
                "camera_url": "0",
                "ia_modo": "IA_LOCAL",
                "ia_ip_remoto": "192.168.1.20",
                "arduino_origem": "SERIAL",
                "distancia_gatilho": 50.0,
                "modo_operacao": "AUTOMATICO"
            }
            cursor.execute("""
                INSERT OR IGNORE INTO sistema_config (id, dados)
                VALUES (1, ?)
            """, (json.dumps(default_config),))
            
            # 2. Tabela: pending_records
            # Prevenção de erro crítico 2: Coluna `sincronizado BOOLEAN DEFAULT 0` inclusa
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pending_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    placa TEXT,
                    nome TEXT,
                    autorizado BOOLEAN,
                    foto BLOB,
                    sincronizado BOOLEAN DEFAULT 0
                )
            """)
            
            # 3. Tabela: usuarios (foco em OWASP)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # 4. Tabela: veiculos_autorizados
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS veiculos_autorizados (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    placa TEXT UNIQUE NOT NULL,
                    nome_condutor TEXT NOT NULL,
                    autorizado BOOLEAN NOT NULL DEFAULT 1
                )
            """)
            
            conn.commit()

    def get_config(self) -> Dict[str, Any]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT dados FROM sistema_config WHERE id = 1")
            row = cursor.fetchone()
            if row and row[0]:
                return json.loads(row[0])
            return {}

    def update_config(self, new_config: Dict[str, Any]):
        current_config = self.get_config()
        current_config.update(new_config)
        
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sistema_config
                SET dados = ?
                WHERE id = 1
            """, (json.dumps(current_config),))
            conn.commit()