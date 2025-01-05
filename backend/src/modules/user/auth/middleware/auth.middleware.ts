import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7); // Remove 'Bearer '

      try {
        const payload = this.jwtService.verify(token, { secret: 'sua-chave-secreta-super-forte' });
        req['user'] = payload; // Anexa o payload ao objeto request
        console.log('AuthMiddleware - Payload anexado à requisição:', payload); // Adicione este log
        next();
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Token not found');
    }
  }
}