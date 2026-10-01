import sys
import os
import asyncio
import serial
import pika
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager

# Injeta o caminho para carregar módulos do diretório 'shared/'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Simulação da importação do repo do diretório compartilhado.
# Em um ambiente real, deve existir um arquivo em shared/repo.py com a função get_config()
try:
    from shared import repo
except ImportError:
    class MockRepo:
        def get_config(self):
            # Mock de fallback
            return {"distancia_gatilho": 50.0, "modo_operacao": "ATIVO"}
    repo = MockRepo()

# Estado global em memória
arduino_state = {
    "status": "online",
    "last_distance": 0.0,
    "gate_status": "closed"
}

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")

def publish_hardware_event(event_data: dict):
    """Publica os eventos de hardware na fila RabbitMQ."""
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue="hardware_events", durable=True)
        channel.basic_publish(
            exchange='',
            routing_key='hardware_events',
            body=json.dumps(event_data),
            properties=pika.BasicProperties(
                delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
            )
        )
        connection.close()
    except Exception as e:
        print(f"Aviso: Não foi possível publicar no RabbitMQ: {e}")

async def hardware_monitor_loop():
    """
    Task de monitorização contínua do hardware (Sensor Ultrassônico).
    Roda em background para não bloquear a API.
    """
    ser = None
    try:
        # Tratamento gracioso se o dispositivo USB não estiver conectado
        ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
        print("Dispositivo físico conectado em /dev/ttyACM0.")
    except serial.SerialException:
        print("Aviso: /dev/ttyACM0 não encontrado. Operando em modo de simulação.")

    while True:
        try:
            # Lê as configurações do repositório compartilhado
            config = repo.get_config()
            distancia_gatilho = config.get("distancia_gatilho", 50.0)
            modo_operacao = config.get("modo_operacao", "INATIVO")
            distancia_atual = 0.0

            # Lógica de leitura do hardware (real ou simulada)
            if ser and ser.is_open:
                if ser.in_waiting > 0:
                    line = ser.readline().decode('utf-8').strip()
                    try:
                        distancia_atual = float(line)
                    except ValueError:
                        pass
            else:
                import random
                # Simulação de variação de distância
                distancia_atual = random.uniform(20.0, 100.0)
            
            # Atualiza o estado global
            arduino_state["last_distance"] = distancia_atual

            # Regra de negócio: gatilho e cooldown
            if modo_operacao != "INATIVO" and distancia_atual <= distancia_gatilho:
                print(f"Gatilho acionado! {distancia_atual:.2f} <= {distancia_gatilho:.2f}")
                
                payload = {
                    "event": "CAPTURE_TRIGGER",
                    "distance": distancia_atual
                }
                publish_hardware_event(payload)
                
                # Cooldown de 5 segundos após disparo
                await asyncio.sleep(5)
            else:
                # Intervalo padrão de leitura
                await asyncio.sleep(1)

        except Exception as e:
            print(f"Erro na thread de monitoramento: {e}")
            await asyncio.sleep(2)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicia o loop de monitoramento de hardware no startup da API
    monitor_task = asyncio.create_task(hardware_monitor_loop())
    yield
    # Limpeza no encerramento da aplicação
    monitor_task.cancel()

app = FastAPI(lifespan=lifespan)

class CommandPayload(BaseModel):
    action: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "arduino"}

@app.get("/api/arduino/status")
def get_arduino_status():
    return arduino_state

@app.get("/api/arduino/distance")
def get_arduino_distance():
    return {"distance": arduino_state["last_distance"]}

@app.post("/api/arduino/command")
def execute_arduino_command(cmd: CommandPayload):
    if cmd.action not in ["open", "close"]:
        raise HTTPException(status_code=400, detail="Ação inválida. Utilize 'open' ou 'close'.")
    
    arduino_state["gate_status"] = cmd.action
    
    # Exemplo: Enviar o comando via porta serial se conectada
    # if ser and ser.is_open:
    #     ser.write(f"{cmd.action}\n".encode('utf-8'))
    
    return {
        "status": "success", 
        "action_executed": cmd.action, 
        "current_state": arduino_state
    }

if __name__ == "__main__":
    import uvicorn
    # Apenas para testes locais, no Docker a inicialização segue o CMD definido no Dockerfile
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)