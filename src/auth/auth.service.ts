import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { GlobalErrorCodes } from "../exceptions/errorCodes/GlobalErrorCodes";
import { RequestBodyException } from "../exceptions/RequestBody.exception";
import { TokenErrorCodes } from "../exceptions/errorCodes/TokenErrorCodes";
import { InternalException } from "../exceptions/Internal.exception";

const jwt = require("jsonwebtoken");

@Injectable()
export class AuthService {
  async verifyToken(req: Request) {
    let token: string;

    if (typeof req.headers["access-token"] === "string") {
      token = req.headers["access-token"].split('"').join("") || req.cookies.token;
    } else if (Array.isArray(req.headers["access-token"])) {
      throw new RequestBodyException({
        key: "USER_TOKEN_NOT_PROVIDED",
        code: TokenErrorCodes.USER_TOKEN_NOT_PROVIDED.code,
        message: TokenErrorCodes.USER_TOKEN_NOT_PROVIDED.value
      });
    }

    if (token) {
      try {
        const decrypt = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          userId: decrypt.userId
        };
      } catch (e) {
        console.log(e.stack);
        throw new RequestBodyException({
          key: "SESSION_EXPIRED",
          code: TokenErrorCodes.SESSION_EXPIRED.code,
          message: TokenErrorCodes.SESSION_EXPIRED.value
        });
      }
    }
  }

  async verifyClientsToken(req: Request) {
    let token: string;

    if (typeof req.headers["client-token"] === "string") {
      token = req.headers["client-token"].split('"').join("") || req.cookies.clientsToken;
    } else if (Array.isArray(req.headers["client-token"])) {
      throw new RequestBodyException({
        key: "CLIENT_TOKEN_NOT_PROVIDED",
        code: TokenErrorCodes.CLIENT_TOKEN_NOT_PROVIDED.code,
        message: TokenErrorCodes.CLIENT_TOKEN_NOT_PROVIDED.value
      });
    }

    if (token) {
      try {
        const decrypt = await jwt.verify(token, process.env.CLIENTS_JWT_SECRET);
        req.client = {
          ip: decrypt.ip,
          clientId: decrypt.clientId
        };
      } catch (e) {
        console.log(e.stack);
        throw new InternalException({
          key: "INTERNAL_ERROR",
          code: GlobalErrorCodes.INTERNAL_ERROR.code,
          message: GlobalErrorCodes.INTERNAL_ERROR.value
        });
      }
    }
  }
}
