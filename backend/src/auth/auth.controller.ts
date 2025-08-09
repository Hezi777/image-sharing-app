// Auth controller - handles HTTP requests for user registration, login, and profile updates
// Uses NestJS decorators for routing and JWT guard for protected endpoints

import { Controller, Post, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register - create new user account
  @Post('register')
  register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  // POST /auth/login - authenticate user and return JWT token
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  // PATCH /auth/me - update user profile (requires JWT authentication)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req, @Body() body: { username: string }) {
    return this.authService.updateProfile(req.user.userId, body.username);
  }
}
