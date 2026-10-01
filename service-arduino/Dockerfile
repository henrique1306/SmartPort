FROM python:3.10-slim

WORKDIR /app

COPY shared/ /app/shared/

COPY service-arduino/requirements.txt /app/service-arduino/requirements.txt
RUN pip install --no-cache-dir -r /app/service-arduino/requirements.txt

COPY service-arduino/ /app/service-arduino/

WORKDIR /app/service-arduino

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]