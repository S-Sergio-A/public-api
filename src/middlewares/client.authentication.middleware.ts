import { NestMiddleware, HttpStatus, Injectable, HttpException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ClientAuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const clientToken = req.headers["client-token"];

    if (clientToken) {
      await this.authService.verifyClientsToken(req);
      next();
    } else {
      throw new HttpException("Please, reload the page.", HttpStatus.UNAUTHORIZED);
    }
  }
}
