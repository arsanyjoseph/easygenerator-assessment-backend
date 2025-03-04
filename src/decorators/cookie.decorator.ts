import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator(
  (
    data: string,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookies = request.cookies as Record<string, string> | undefined;

    if (!cookies) return undefined;

    return data ? cookies[data] : cookies;
  },
);
