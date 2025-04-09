import { Controller, Body, Post } from '@nestjs/common';
import { APIResponse } from '../types/api';
import { AuthService } from './auth.service';

interface User {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() user: User): Promise<APIResponse<{ access_token: string }>> {
    try {
      const data = await this.authService.signup(user);
      return {
        message: 'User created successfully',
        data: data,
      };
    } catch (error: unknown) {
      console.error('Signup error:', error);
  
      if (error instanceof Error && error.message === 'User already exists') {
        return {
          error: 'User already exists',
        };
      }
      return {
        error: 'An unexpected error occurred. Please try again later.',
      };
    }
  }

  @Post('login')
  async login(@Body() user: User): Promise<APIResponse<{ access_token: string }>> {
    try{
      const data = await this.authService.login(user);
      return {
        message: 'Login successful',
        data: data,
      }
    } catch {
      return {
        error: 'Invalid credentials',
      };
    }
  }
}
