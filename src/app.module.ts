import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
// import { UserAuthenticationMiddleware } from './middlewares/entrance.authentication.middleware';
// import { UserController } from './entrance/entrance.controller';
import { ValidationModule } from "./pipes/validation.module";
// import { AuthModule } from './auth/auth.module';
import { EntranceModule } from "./entrance/entrance.module";
import { EntranceController } from "./entrance/entrance.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 300,
      limit: 10,
      ignoreUserAgents: [new RegExp("googlebot", "gi"), new RegExp("bingbot", "gi")]
    }),
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
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(UserAuthenticationMiddleware)
  //     .exclude(
  //       { path: '/entrance/sign-up', method: RequestMethod.POST },
  //       { path: '/entrance/forgot-password', method: RequestMethod.POST },
  //       { path: '/entrance/forgot-password-verify', method: RequestMethod.PUT }
  //     )
  //     .forRoutes(UserController);
  // }
}
