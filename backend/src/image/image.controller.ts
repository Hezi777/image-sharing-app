// Image controller that handles all image-related HTTP requests
// Provides endpoints for uploading, retrieving, liking, and commenting on images

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Controller for managing image uploads, retrieval, and social interactions
// Handles file uploads with unique naming and provides RESTful API endpoints
@Controller('images')
export class ImageController {
  constructor(private readonly svc: ImageService) {}

  // Upload a new image file to the server
  // Uses multer middleware to handle file uploads with custom storage configuration
  // 
  // File upload configuration:
  // - Destination: './uploads' directory
  // - Filename: Timestamp + random number + original extension
  // - Creates unique filenames to prevent conflicts
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Store files in uploads directory
      filename: (req, file, cb) => {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname); // Get original file extension
        cb(null, `${uniqueSuffix}${extension}`);
      }
    })
  }))
  upload(@UploadedFile() file: Express.Multer.File) {
    // Create image record in database with file information
    return this.svc.create({
      filename: file.filename, // Generated unique filename
      originalName: file.originalname, // Original file name
      url: `/uploads/${file.filename}`, // Public URL for accessing the file
    });
  }

  // Retrieve all images from the database
  // Returns images with their associated comments and metadata
  @Get()
  all() {
    return this.svc.findAll();
  }

  // Like an image by incrementing its like count
  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.svc.like(Number(id));
  }

  // Add a comment to a specific image
  @Post(':id/comment')
  comment(
    @Param('id') id: string,
    @Body('text') text: string,
  ) {
    return this.svc.comment(Number(id), text);
  }
}
