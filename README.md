# Plataforma Ecommerce — Microservicios

Backend de comercio electrónico construido con NestJS, PostgreSQL y Docker.

## Arquitectura

Tres servicios NestJS comparten una instancia PostgreSQL, cada uno con su propio esquema para mantener una separación lógica y su comunicacion asincrona mediante eventos (mensajes).

## Inicio rápido

**Requisitos:** Docker y Docker Compose instalados.

```bash
# 1. Clonar repositorio

git clone <url-repo>

# 2. Ingresar al proyecto

cd ecommerce-backend-microservicios

# 3. Renombrar el .env.example a .env

# 4. Reemplazar las variables de entorno

# 5. Levantar todo

docker compose --env-file .env up --build -d
```

PostgreSQL, RabbitMQ, ambos microservicios y el gateway se inician automáticamente.

## Endpoints de API

Todas las solicitudes pasan por el **API Gateway en el puerto 3000**.

### Productos

| Método | Ruta            | Descripción             |
| ------ | --------------- | ----------------------- |
| GET    | `/products`     | Listar productos        |
| GET    | `/products/:id` | Obtener producto por ID |
| POST   | `/products`     | Crear producto          |
| PATCH  | `/products/:id` | Actualizar producto     |

### Orders

| Método | Ruta          | Descripción           |
| ------ | ------------- | --------------------- |
| GET    | `/orders`     | Listar pedidos        |
| GET    | `/orders/:id` | Obtener pedido por ID |
| POST   | `/orders`     | Crear pedido          |

## Beneficios de la arquitectura

**Escalabilidad**

- Cada servicio (`catalog-service`, `orders-service`, `api-gateway`) es autónomo y se puede replicar / escalar de forma independiente.
- El gateway soporta un único endpoint público (`3000`) con reenvío interno a `3001` y `3002`; puedes balancear horizontalmente solo la parte que se necesita.
- Base de datos con separación lógica por esquema minimiza bloqueo de recursos y permite escalar lectura/escritura de manera independiente.

**Mantenibilidad**

- Código modular: arquitectura hexagonal en cada servicio (`application/use-cases`, `domain`, `infrastructure`).
- Cambios de producto no afectan pedidos y viceversa.
- DTOs + Swagger en cada servicio aseguran documentación clara y validación automática.

**Separación de responsabilidades (SoC)**

- API Gateway: enrutamiento y docs (Swagger). Sin lógica de negocio de dominio.
- Catalog Service: gestión de catálogo.
- Orders Service: gestión de pedidos.
- Comunicación: `orders-service` consulta `catalog-service` para stock (actual) mediante eventos (RPC) - (Pub / Sub) y guarda snapshot para historial.

## Decisiones técnicas

**Base de datos compartida, esquemas separados** — Cada servicio es dueño de su propio esquema (`catalog` y `orders`) en una misma instancia PostgreSQL. Esto simplifica el despliegue local y mantiene separación lógica de datos.

\*\*Comunicación asincrónica entre servicios (RabbitMQ) — Orders Service publica un evento/comando en RabbitMQ para que Catalog Service valide el stock y genere el snapshot del producto al crear el pedido. Este enfoque desacopla los servicios y mejora la escalabilidad; además, permite manejar alta carga mediante colas y procesamiento distribuido con opcion a futuro de escalar con retries y sistema de idepotency.

**Snapshot de datos en pedidos** — Al crear un pedido se guarda el nombre y precio del producto en el propio pedido. De este modo, el historial no se rompe aunque el producto se actualice luego.

**API Gateway como proxy simple** — El gateway enruta y centraliza las API sin contener lógica de negocio. Su responsabilidad es la entrada unificada.

**Comunicación vía RabbitMQ (mensajería entre microservicios)** — API Gateway usa `ClientProxy` de NestJS con `transport: Transport.RMQ` para enviar mensajes a los servicios.

- `orders-service` y `catalog-service` exponen listeners con `@MessagePattern("orders.create")`, `@MessagePattern("catalog.products.findAll")`, etc.
- El gateway realiza llamadas asíncronas (ej. `this.orders.send("orders.create", dto).pipe(timeout(5000))`) y recibe respuestas por el mismo canal.
- Esto desacopla los servicios, mejora tolerancia a fallas y permite escalar servicios independiente.

## Pipeline de CI/CD

El workflow de GitHub Actions (`.github/workflows/ci.yml`) se ejecuta en cada push:

1. **Build & Lint** — instala dependencias y compila los 3 servicios en paralelo
2. **Version Bump** — incrementa la versión patch en `main` y crea un tag git
3. **Changelog** — genera `CHANGELOG.md` a partir de los mensajes de commit
