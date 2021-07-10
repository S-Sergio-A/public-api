import { NestMiddleware, HttpStatus, Injectable, HttpException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserAuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers["access-token"];

    if (accessToken) {
      await this.authService.verifyToken(req);
      next();
    } else {
      throw new HttpException("Not authorized.", HttpStatus.UNAUTHORIZED);
    }
  }
}
