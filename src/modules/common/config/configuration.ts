import * as process from "process";
import * as dotenv from "dotenv";
dotenv.config();

export default () => ({
  app: {
    authToken: process.env.AUTH_TOKEN,
    port: process.env.INFRASTRUCTURE_APP_PORT,
    environment: process.env.ENVIRONMENT
  },
  rabbitConfig: {
    protocol: "amqp",
    hostname: process.env.RABBIT_HOST,
    port: process.env.RABBIT_PORT ? +process.env.RABBIT_PORT : 5672,
    username: process.env.RABBIT_USERNAME,
    password: process.env.RABBIT_PASSWORD
  }
});
