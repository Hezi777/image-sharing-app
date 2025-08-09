// JWT strategy - configures Passport to validate JWT tokens from Authorization header
// Used by JwtAuthGuard to protect routes that require authentication

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  // Extract user info from JWT payload - called automatically by Passport
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
