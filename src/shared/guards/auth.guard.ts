import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;
    if (!token) return false;

    return await this.isValidToken(token, req);
  }

  async isValidToken(token: string, req): Promise<boolean> {
    try {
      const user = await jwt.verify(token, 'FML', { ignoreExpiration: true });
      req.user = user;
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
