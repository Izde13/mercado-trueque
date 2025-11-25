# Módulo ZMQ - Publicación de Eventos

Este módulo integra ZeroMQ con NestJS para publicar eventos a workers externos (ej: Python) que se encargan de tareas asincrónicas como envío de correos.

## Propósito

Publicar eventos simples desde NestJS a través de ZeroMQ para que aplicaciones externas (subscribers) los procesen de forma asincrónica. El backend NestJS notifica eventos, y Python se encarga de ejecutarlos (ej: enviar correos).

## Arquitectura

```
NestJS (Backend)
    ↓
"SendEmail user@example.com" ← Evento simple
    ↓
ZMQ PUB Socket (tcp://127.0.0.1:5556)
    ↓
trade_subscriber.py (Python Worker)
    ↓
Recibe evento y envía correo
```

## Componentes

### ZmqProducerService

- **Ubicación**: `zmq-producer.service.ts`
- **Responsabilidad**: Publicar eventos a ZeroMQ
- **Métodos públicos**:
  - `publishEvent(eventType, data)`: Publica un evento simple
  - `getConnectionStatus()`: Retorna si está conectado
  - `getZmqUrl()`: Retorna la URL de conexión

## Uso

### Publicar un Evento

```typescript
@Inject(ZmqProducerService)
private zmq: ZmqProducerService;

// Cuando se crea una propuesta:
await this.zmq.publishEvent('SendEmail', 'user@example.com user2@example.com');

// Cuando se acepta:
await this.zmq.publishEvent('SendEmail', 'owner@example.com');

// Cuando se completa:
await this.zmq.publishEvent('SendEmail', 'user1@example.com user2@example.com');
```

## Formato de Eventos

Los eventos se publican en formato simple:

```
"SendEmail email1@example.com email2@example.com"
         ↑     ↑
      tipo    datos
```

El subscriber en Python filtra por el tipo (SendEmail) y procesa los datos.

## Configuración

### Variables de Entorno

```env
# URL de conexión (debe coincidir con subscriber.py)
ZMQ_URL=tcp://127.0.0.1:5556
```

## Ciclo de Vida

1. **Inicialización**: `ZmqProducerService.onModuleInit()` conecta a ZMQ
2. **Operación**: Llamas a `publishEvent()` desde tus servicios
3. **Shutdown**: `ZmqProducerService.onModuleDestroy()` cierra conexión

## Testing

### Verificar Conexión

```bash
curl http://localhost:3000/zmq-status
```

Respuesta:
```json
{
  "connected": true,
  "url": "tcp://127.0.0.1:5556"
}
```

### Publicar Evento Manual

Desde Python:
```bash
python
>>> import zmq
>>> ctx = zmq.Context()
>>> sub = ctx.socket(zmq.SUB)
>>> sub.connect("tcp://localhost:5556")
>>> sub.setsockopt_string(zmq.SUBSCRIBE, "SendEmail")
>>> print(sub.recv_string())  # Espera a que NestJS publique
```

## Referencias

- [ZeroMQ Documentation](https://zeromq.org/)
- [zeromq.js GitHub](https://github.com/zeromq/zeromq.js)
