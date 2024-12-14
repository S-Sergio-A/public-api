import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PublicModule } from "~/public/public.module";
import { RabbitModule } from "~/modules/rabbit";
import { defaultImports } from "~/modules/common/config";
import { AuthModule } from "~/modules/auth/auth.module";
import { HealthCheckModule, LoggerModule } from "@ssmovzh/chatterly-common-utils";

@Module({
  imports: [
    ...defaultImports,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 120,
          limit: 500,
          ignoreUserAgents: [new RegExp("googlebot", "gi"), new RegExp("bingbot", "gi")]
        }
      ]
    }),
    LoggerModule,
    AuthModule,
    PublicModule,
    RabbitModule,
    HealthCheckModule
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
