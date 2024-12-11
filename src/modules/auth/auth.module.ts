import { Module } from "@nestjs/common";
import { AUTH_IMPORTS } from "~/modules/common/constants";

@Module({
  imports: [...AUTH_IMPORTS]
})
export class AuthModule {}
