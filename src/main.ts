import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import helmet from "helmet";
import { ApiResponseService, ResponseSourcesEnum } from "@ssmovzh/chatterly-common-utils";
import { LoggerService } from "~/modules/common/logger";
import { ExceptionsFilter } from "~/modules/common/filters";
import { AppModule } from "./app.module";
import { CustomHeadersEnum } from "~/modules/common";

(async () => {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = "api/v1";
  ApiResponseService.setSource(ResponseSourcesEnum.PUBLIC_API);
  app.setGlobalPrefix(apiPrefix);

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.use(helmet());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true
    })
  );
  app.enableCors({
    origin: [process.env.FRONT_URL],
    credentials: true,
    exposedHeaders: Object.values(CustomHeadersEnum),
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"]
  });

  const logger = await app.resolve(LoggerService); // Use resolve() for transient scoped providers

  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  const config = new DocumentBuilder()
    .setTitle("Public API Docs")
    .setVersion("1.0.0")
    .setDescription("REST API endpoints description.")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    jsonDocumentUrl: `${apiPrefix}/json`
  });

  await app.listen(process.env.PORT || 4000);
})();
