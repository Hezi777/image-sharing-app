// Image controller - handles file uploads and image interactions (like, comment, delete)
// Uses Multer for file uploads and JWT guards to protect authenticated endpoints

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
import { randomUUID } from 'crypto';

@Controller('images')
export class ImageController {
  constructor(private readonly svc: ImageService) {}

  // POST /images/upload - handles file upload with Multer, stores to disk and saves metadata
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${randomUUID()}${extname(file.originalname).toLowerCase()}`;
        cb(null, filename);
      }
    }),
    fileFilter: (_req, file, cb) => {
      const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
      cb(null, allowed.has(file.mimetype));
    },
    limits: { fileSize: 5 * 1024 * 1024 }
  }))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
    @Request() req?: any,
  ) {
    return this.svc.create({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      description,
      uploaderId: req.user.userId,
    });
  }

  // POST /images/:id/like - increment like count for image
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  like(@Param('id') id: string) {
    return this.svc.like(Number(id));
  }

  // DELETE /images/:id/like - decrement like count for image
  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  unlike(@Param('id') id: string) {
    return this.svc.unlike(Number(id));
  }

  // POST /images/:id/comment - add comment to image
  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  comment(
    @Param('id') id: string,
    @Body('text') text: string,
    @Request() req?: any,
  ) {
    return this.svc.comment(Number(id), text, req.user.userId);
  }

  // DELETE /images/:id - remove image and its file
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.svc.delete(Number(id));
  }

  // GET /images - fetch paginated images with optional search
  @Get()
  all(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.svc.findAll(search, pageNum, limitNum);
  }
}
