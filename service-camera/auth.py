import sys
sys.path.insert(0, '/app/shared')

import sqlite3
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel

# Configurações de Segurança
SECRET_KEY = "super_secret_key_owasp_compliant_change_in_prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
router = APIRouter(prefix="/api/auth", tags=["Auth"])

class UserCreate(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_auth_db():
    """Garante a criação da tabela de usuários e usuário padrão"""
    with sqlite3.connect("database.db") as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)
        
        # Criar usuário padrão (admin:admin123)
        try:
            hashed_pwd = pwd_context.hash("admin123")
            conn.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                ("admin", hashed_pwd)
            )
            conn.commit()
            print("[Auth] Usuário padrão 'admin' criado.")
        except sqlite3.IntegrityError:
            pass  # Usuário já existe

init_auth_db()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: sqlite3.Connection = Depends(get_db)):
    """Registra um novo usuário"""
    cursor = db.execute("SELECT id FROM users WHERE username = ?", (user.username,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Usuário já existe")
    
    hashed_pwd = pwd_context.hash(user.password)
    db.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (user.username, hashed_pwd))
    db.commit()
    return {"msg": "Usuário registrado com sucesso"}

@router.post("/login")
def login(credentials: LoginRequest, db: sqlite3.Connection = Depends(get_db)):
    """Login com JSON (compatível com frontend)"""
    cursor = db.execute("SELECT * FROM users WHERE username = ?", (credentials.username,))
    user = cursor.fetchone()
    
    # Mitigação OWASP: Anti-User Enumeration. Mensagem genérica para falha de login.
    if not user or not pwd_context.verify(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = {"sub": user["username"], "exp": expire}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: sqlite3.Connection = Depends(get_db)):
    """Valida o token JWT e retorna o usuário"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    cursor = db.execute("SELECT username FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    if user is None:
        raise credentials_exception
    return user["username"]
