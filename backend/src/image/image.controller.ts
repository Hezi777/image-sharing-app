// Image controller that handles all image-related HTTP requests
// Provides endpoints for uploading, retrieving, liking, and commenting on images

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageService } from './image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Main controller for image-related endpoints: upload, list, like, comment
@Controller('images')
export class ImageController {
  constructor(private readonly svc: ImageService) {}

  // Upload image: receives a file, stores it locally, creates DB record
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Store files in uploads directory
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = extname(file.originalname); // Get original file extension
        cb(null, `${uniqueSuffix}${extension}`);
      }
    })
  }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
    @Request() req?: any,
  ) {
    // Create image record in database with file information
    return this.svc.create({
      filename: file.filename, // Generated unique filename
      originalName: file.originalname, // Original file name
      url: `/uploads/${file.filename}`, // Public URL for accessing the file
      description,
      uploaderId: req.user.userId,
    });
  }

  // Like an image by ID
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  like(@Param('id') id: string) {
    return this.svc.like(Number(id));
  }

  // Unlike an image by ID
  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  unlike(@Param('id') id: string) {
    return this.svc.unlike(Number(id));
  }

  // Comment on an image by ID
  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  comment(
    @Param('id') id: string,
    @Body('text') text: string,
    @Request() req?: any,
  ) {
    return this.svc.comment(Number(id), text, req.user.userId);
  }

  // Delete an image by ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.svc.delete(Number(id));
  }

  // Fetch all images (with comments, likes, etc.)
  @Get()
  all(@Query('search') search?: string) {
    return this.svc.findAll(search);
  }
}
