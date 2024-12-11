import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JWT_TOKEN_EXPIRATION } from "./system.constant";

export const AUTH_IMPORTS = [
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: () => ({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: JWT_TOKEN_EXPIRATION }
    })
  })
];
