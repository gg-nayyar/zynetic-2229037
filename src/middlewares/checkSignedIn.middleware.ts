import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'prisma.service';

@Injectable()
export class SignInMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log("MIDDLEWARE RUNNING");
    const token = req.headers['authorization']?.split(' ')[1];
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try{
        const payload = await this.jwtService.verifyAsync<{
            sub: string;
            email: string;
        }>(token, { secret: process.env.JWT_SECRET });
        const userId = payload.sub;
        const user = await this.prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.locals.user = user;
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

