import * as process from "process";
import * as dotenv from "dotenv";
import { AppConfigInterface, RabbitConfigInterface, TokenConfigInterface } from "@ssmovzh/chatterly-common-utils";

dotenv.config();

export default () => ({
  app: {
    port: +process.env.PORT,
    environment: process.env.ENVIRONMENT,
    clientUrl: process.env.CLIENT_URL
  } as AppConfigInterface,
  rabbitConfig: {
    protocol: "amqp",
    hostname: process.env.RABBIT_HOST,
    port: process.env.RABBIT_PORT ? +process.env.RABBIT_PORT : 5672,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD,
    uri: process.env.RABBIT_URI,
    apiKey: process.env.RABBIT_API_KEY
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
