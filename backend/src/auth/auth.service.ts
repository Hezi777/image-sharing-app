// Authentication service - handles user registration, login, and profile updates
// Uses bcrypt for password hashing and JWT tokens for session management

import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Register new user - checks username availability, hashes password, creates user record
  async register(username: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username },
    };
  }

  // Login user - verifies credentials using bcrypt and returns JWT token
  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username },
    };
  }

  // Update user profile - allows username changes with duplicate checking
  async updateProfile(userId: number, newUsername: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (newUsername !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: newUsername },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

    return {
      user: { id: updatedUser.id, username: updatedUser.username },
    };
  }
}
