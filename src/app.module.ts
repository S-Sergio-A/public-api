import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PublicController } from "~/public/public.controller";
import { ValidationModule } from "~/pipes/validation.module";
import { PublicModule } from "~/public/public.module";
import { RabbitModule } from "~/modules/rabbit";
import { HealthCheckModule } from "~/modules/health-check/health-check.module";
import { defaultImports } from "~/modules/common/config";
import { AuthModule } from "~/modules/auth/auth.module";

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
    AuthModule,
    PublicModule,
    ValidationModule,
    RabbitModule,
    HealthCheckModule
  ],
  controllers: [PublicController],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
