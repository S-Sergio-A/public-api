import * as process from "node:process";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadInterface, TokenInterface } from "@ssmovzh/chatterly-common-utils";

export async function getAuthDataFunction(options: { tokens: TokenInterface; jwtService: JwtService }) {
  try {
    const { tokens, jwtService } = options;

    const payload: JwtPayloadInterface = await jwtService.verifyAsync(tokens.accessToken, {
      secret: process.env.JWT_SECRET
    });

    if (!payload || (!payload.userId && !payload.clientId)) {
      throw new UnauthorizedException("Invalid token");
    }

    return {
      ip: payload.ip,
      userId: payload.userId,
      clientId: payload.clientId
    };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
}
