import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

export const AUTH_IMPORTS = [
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME }
    }),
    global: true
  })
];
