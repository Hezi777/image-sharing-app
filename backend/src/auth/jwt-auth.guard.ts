// JWT auth guard - protects routes by requiring valid JWT token in Authorization header
// Use @UseGuards(JwtAuthGuard) on controllers/methods that need authentication

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
