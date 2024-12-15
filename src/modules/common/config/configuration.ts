import * as process from "process";
import * as dotenv from "dotenv";
import { AppConfigInterface, MongoConfigInterface, RabbitConfigInterface, TokenConfigInterface } from "@ssmovzh/chatterly-common-utils";

dotenv.config();

export default () => ({
  app: {
    port: +process.env.PORT,
    environment: process.env.ENVIRONMENT,
    clientUrl: process.env.CLIENT_URL
  } as AppConfigInterface,
  mongo: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    clusterUrl: process.env.MONGO_CLUSTER_URL,
    database: process.env.MONGO_DATABASE_NAME
  } as MongoConfigInterface,
  rabbitConfig: {
    protocol: "amqp",
    hostname: process.env.RABBIT_HOST,
    port: process.env.RABBIT_PORT ? +process.env.RABBIT_PORT : 5672,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD
  } as RabbitConfigInterface,
  jwt: {
    secret: process.env.JWT_SECRET,
    clientSecret: process.env.CLIENTS_JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    longExpiresIn: process.env.JWT_EXPIRATION_TIME_LONG
  } as TokenConfigInterface
});
