import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

interface User {
  email: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async signup(data: User): Promise<{ access_token: string }> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
        },
      });
      return this.signToken(user.id, user.email);
    } catch {
      throw new Error('User already exists');
    }
  }
  async login(data: User): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    return this.signToken(user.id, user.email);
  }
  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const token = await this.jwtService.signAsync(
      { sub: userId, email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );
    return {
      access_token: token,
    };
  }
}
