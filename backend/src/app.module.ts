// Main application module that configures the entire NestJS application
// This module imports all necessary modules and configures the application structure

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';

// Root application module that orchestrates all application components
// 
// Imports:
// - ConfigModule: Provides environment variable configuration
// - PrismaModule: Database connection and ORM functionality
// - ImageModule: Image upload, storage, and management functionality
// - AuthModule: User authentication and JWT functionality
// 
// Controllers:
// - AppController: Basic application routes and health checks
// 
// Providers:
// - AppService: Basic application business logic
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot(),
    // Database connection and ORM functionality
    PrismaModule,
    // Image upload and management functionality
    ImageModule,
    // User authentication and JWT functionality
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
