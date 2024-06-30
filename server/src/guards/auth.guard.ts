import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const { url } = request;

      const unprotectedRoutes = ['/auth/signup', '/auth/signin'];

      if (unprotectedRoutes.includes(url)) {
        return true;
      }

      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Missing or invalid authorization header');
        return false;
      }

      const token = authHeader.split(' ')[1];

      const decoded = this.jwtService.verify(token, {
        secret: 'random123',
      });

      request.user = decoded;
      return true;
    } catch (error) {
      console.error('Error in authentication:', error.message);
      return false;
    }
  }
}
