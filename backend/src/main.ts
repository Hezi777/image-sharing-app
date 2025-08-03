// Main application entry point for the NestJS backend server
// This file bootstraps the application and configures essential middleware

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

// Bootstrap function that initializes and starts the NestJS application
// Configures static file serving and starts the HTTP server
async function bootstrap() {
  // Create a new NestJS application instance with Express platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure static file serving for uploaded images
  // This allows the frontend to access uploaded files via /uploads/ URL path
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // URL prefix for accessing static files
  });

  // Start the HTTP server on the specified port (default: 3001)
  // Uses environment variable PORT if available, otherwise defaults to 3001
  await app.listen(process.env.PORT ?? 3001);
}

// Start the application
bootstrap();
