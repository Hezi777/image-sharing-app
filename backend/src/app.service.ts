// Main application service that provides basic application business logic
// This service handles non-image-specific application functionality

import { Injectable } from '@nestjs/common';

// Application service for basic business logic and health checks
// Provides simple utility methods for the application
@Injectable()
export class AppService {
  // Returns a simple greeting message
  // Used for health checks and basic application verification
  getHello(): string {
    return 'Hello World!';
  }
}
