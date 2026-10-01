FROM python:3.10-slim

# Evita a criação de arquivos .pyc e garante que os logs sejam exibidos em tempo real no console
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalação de dependências de sistema necessárias para compilar pacotes como bcrypt/cryptography
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Diretório raiz de trabalho para permitir importações compartilhadas
WORKDIR /app

# Copia os módulos compartilhados
COPY shared/ /app/shared/

# Copia o requirements do serviço
COPY service-camera/requirements.txt /app/service-camera/

# Instala as dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/service-camera/requirements.txt

# Copia o código do microsserviço
COPY service-camera/ /app/service-camera/

# Define o diretório de trabalho para o serviço
WORKDIR /app/service-camera

# Exposição da porta padrão do FastAPI
EXPOSE 8000

# Comando de execução estrito (evitando "uvicorn service-camera.main:app" devido ao WORKDIR atual)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
