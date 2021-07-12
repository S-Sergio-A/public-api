import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { UserAuthenticationMiddleware } from "./middlewares/user.authentication.middleware";
import { ClientAuthMiddleware } from "./middlewares/client.authentication.middleware";
import { PublicController } from "./public/public.controller";
import { ValidationModule } from "./pipes/validation.module";
import { PublicModule } from "./public/public.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl: 1000,
      limit: 40,
      ignoreUserAgents: [new RegExp("googlebot", "gi"), new RegExp("bingbot", "gi")]
    }),
    AuthModule,
    PublicModule,
    ValidationModule
  ],
  controllers: [PublicController],
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
        { path: "/public/email", method: RequestMethod.PUT },
        { path: "/public/password", method: RequestMethod.PUT },
        { path: "/public/phone", method: RequestMethod.PUT },
        { path: "/public/optional", method: RequestMethod.PUT },
        { path: "/public/refresh-session", method: RequestMethod.GET }
      );
  }
}
