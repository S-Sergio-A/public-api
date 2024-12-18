import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
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
    const tokens = extractTokenFromHeaderFunction(request);

    if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
      throw new UnauthorizedException("Wrong authentication token");
    }

    try {
      request.body.authData = await getAuthDataFunction({
        tokens,
        jwtService: this.jwtService
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}
