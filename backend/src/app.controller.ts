// Main application controller that handles basic application routes
// Provides health checks and test file serving functionality

import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { createReadStream } from 'fs';

// Application controller for basic routes and health checks
// This controller handles non-image-specific functionality
@Controller()
export class AppController {
  // Serves a test file from the uploads directory
  // This endpoint is used for testing file serving functionality
  @Get('test-file')
  getTestFile(@Res() res: Response) {
    // Construct the path to the test file in the uploads directory
    const filePath = join(__dirname, '..', '..', 'uploads', 'test.png');
    // Create a read stream for the file
    const stream = createReadStream(filePath);
    // Pipe the file stream directly to the response
    stream.pipe(res);
  }
}
