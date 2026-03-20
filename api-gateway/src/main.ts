import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Ecommerce API Gateway")
    .setDescription(
      `Punto de acceso único para la plataforma de comercio electrónico.

## Servicios
- **Servicio de Catalogo** — gestiona los productos (puerto 3001)
- **Servicio de Ordenes** — gestiona los pedidos y valida el stock (puerto 3002)

## Notas
- Todas las solicitudes pasan por esta puerta de enlace en el puerto 3000
- La puerta de enlace reenvía las solicitudes al servicio de destino correspondiente`,
    )
    .setVersion("1.0")
    .addServer("http://localhost:3000", "API Gateway")
    .addTag("products", "Product catalog operations")
    .addTag("orders", "Order management operations")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
    },
  });

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`API Gateway running on port ${port}`);

  console.log(`Swagger docs → http://localhost:${port}/docs`);
}

bootstrap();
