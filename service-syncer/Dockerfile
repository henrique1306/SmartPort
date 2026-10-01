FROM python:3.10-slim

# Define o diretório de trabalho raiz
WORKDIR /app

# Copia os módulos compartilhados para o container
COPY shared/ /app/shared/

# Copia o arquivo de dependências e instala sem cache para reduzir tamanho da imagem
COPY service-syncer/requirements.txt /app/service-syncer/requirements.txt
RUN pip install --no-cache-dir -r /app/service-syncer/requirements.txt

# Copia o código-fonte e credenciais do microsserviço
COPY service-syncer/ /app/service-syncer/

# Define o diretório de trabalho específico do microsserviço
WORKDIR /app/service-syncer

# Expõe a porta interna da aplicação
EXPOSE 8000

# Executa o Uvicorn diretamente no CMD para evitar loop de reinicialização (código de saída 0 do python)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]