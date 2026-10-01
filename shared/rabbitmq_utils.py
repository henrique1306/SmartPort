import pika
import json
import logging
from typing import Dict, Any, Callable

logger = logging.getLogger(__name__)

class RabbitMqManager:
    def __init__(self, host: str = "rabbitmq"):
        self.host = host

    def publish_event(self, queue_name: str, payload: Dict[str, Any]):
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=self.host)
            )
            channel = connection.channel()

            # Declara a fila assegurando que ela sobreviva a reinicializações do broker
            channel.queue_declare(queue=queue_name, durable=True)

            # Publica o payload na fila especificada
            channel.basic_publish(
                exchange='',
                routing_key=queue_name,
                body=json.dumps(payload),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Torna a mensagem persistente no disco
                )
            )
            
            logger.debug(f"Evento publicado com sucesso na fila '{queue_name}'.")
            connection.close()
            
        except Exception as e:
            logger.error(f"Erro ao publicar evento na fila '{queue_name}': {e}")
            # Em arquiteturas offline-first, essa exceção deve ser monitorada ou tratada 
            # pelas camadas superiores para armazenar os eventos falhos (fallback).

    def publish(self, queue: str, message: Dict[str, Any]):
        """Alias para publish_event para compatibilidade"""
        self.publish_event(queue, message)

    def consume(self, queue: str, callback: Callable):
        """Consome mensagens de uma fila com callback"""
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=self.host)
            )
            channel = connection.channel()
            
            # Declara a fila
            channel.queue_declare(queue=queue, durable=True)
            
            # Define o callback
            channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
            
            logger.info(f"Iniciando consumo da fila '{queue}'...")
            channel.start_consuming()
            
        except Exception as e:
            logger.error(f"Erro ao consumir fila '{queue}': {e}")
