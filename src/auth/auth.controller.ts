import { Controller, Body, Post } from '@nestjs/common';
import { APIResponse } from '../types/api';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class User {
  email: string;
  password: string;
}

class AuthResponse {
  access_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: User,
    description: 'The email and password of the user to be registered',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 500,
    description: 'An unexpected error occurred',
  })
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
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({
    type: User,
    description: 'The email and password of the user to log in',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() user: User): Promise<APIResponse<{ access_token: string }>> {
    try {
      const data = await this.authService.login(user);
      return {
        message: 'Login successful',
        data: data,
      };
    } catch {
      return {
        error: 'Invalid credentials',
      };
    }
  }
}
