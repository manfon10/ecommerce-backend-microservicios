import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? "amqp://admin:admin@localhost:5672"],
      queue: "orders_queue",
      queueOptions: { durable: true },
      noAck: false,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Microservicio - Gestion de Ordenes")
    .setDescription("Gestion de Ordenes — escucha en la cola de RabbitMQ: orders_queue")
    .setVersion("1.0")
    .build();

  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3002);

  console.log("Orders Service listening on RabbitMQ queue: orders_queue");
}

bootstrap();
