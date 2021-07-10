import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { EntranceController } from "./entrance/entrance.controller";
import { ValidationModule } from "./pipes/validation.module";
import { EntranceModule } from "./entrance/entrance.module";
import { AuthModule } from "./auth/auth.module";
import { ClientAuthMiddleware } from "./middlewares/client.authentication.middleware";
import { UserAuthenticationMiddleware } from "./middlewares/user.authentication.middleware";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 1000,
      limit: 40,
      ignoreUserAgents: [new RegExp("googlebot", "gi"), new RegExp("bingbot", "gi")]
    }),
    AuthModule,
    EntranceModule,
    ValidationModule
  ],
  controllers: [EntranceController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientAuthMiddleware)
      .forRoutes({ path: "client/contact", method: RequestMethod.ALL })
      .apply(UserAuthenticationMiddleware)
      .forRoutes(
        { path: "/entrance/email/:id", method: RequestMethod.PUT },
        { path: "/entrance/password/:id", method: RequestMethod.PUT },
        { path: "/entrance/phone/:id", method: RequestMethod.PUT },
        { path: "/entrance/optional/:id", method: RequestMethod.PUT },
        { path: "/entrance/refresh-session", method: RequestMethod.GET }
      );
  }
}
