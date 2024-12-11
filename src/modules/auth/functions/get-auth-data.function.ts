import * as process from "node:process";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadInterface } from "@ssmovzh/chatterly-common-utils";

export async function getAuthDataFunction(options: { token: string; jwtService: JwtService }) {
  try {
    const { token, jwtService } = options;

    const payload: JwtPayloadInterface = await jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY
    });

    if (!payload || !payload.ip || !payload.clientId) {
      throw new UnauthorizedException("Invalid token");
    }

    return {
      ip: payload.ip,
      clientId: payload.clientId
    };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
}
