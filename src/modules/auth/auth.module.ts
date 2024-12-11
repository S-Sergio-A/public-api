import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AUTH_IMPORTS } from "~/modules/common/constants";
import { AuthGuard } from "./auth.guard";

@Module({
  imports: [...AUTH_IMPORTS],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}
