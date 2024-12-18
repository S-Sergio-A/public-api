import { Request } from "express";
import { TokenInterface } from "@ssmovzh/chatterly-common-utils";

export function extractTokenFromHeaderFunction(request: Request): TokenInterface {
  const accessToken = (request.headers["x-access-token"] as string).replace("Bearer ", "");
  const refreshToken = (request.headers["x-refresh-token"] as string).replace("Bearer ", "");
  return { accessToken, refreshToken };
}
