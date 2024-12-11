import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthDataInject = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.body.authData;
});
