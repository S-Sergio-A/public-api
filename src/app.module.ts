import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PublicModule } from "~/public/public.module";
import { RabbitModule } from "~/modules/rabbit";
import { HealthCheckModule } from "~/modules/health-check/health-check.module";
import { defaultImports } from "~/modules/common/config";
import { AuthModule } from "~/modules/auth/auth.module";
import { LoggerModule } from "~/modules/common";

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
