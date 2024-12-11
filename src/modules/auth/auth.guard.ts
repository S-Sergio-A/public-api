import * as url from "url";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { isArray } from "class-validator";
import { IS_PUBLIC_KEY } from "~/modules/common/constants";
import { extractTokenFromHeaderFunction, getAuthDataFunction } from "~/modules/auth/functions";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaderFunction(request);

    const queryParams = url.parse(request.url, true).query;
    let queueToken = queryParams["auth-token"] ?? null;

    if (!token && !queueToken) {
      throw new UnauthorizedException("Wrong authentication token");
    }

    if (isArray(queueToken)) {
      queueToken = queueToken[0];
    }

    try {
      request.body.authData = await getAuthDataFunction({
        token: token ?? queueToken,
        jwtService: this.jwtService
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
