// Image service - handles all image-related business logic (upload, search, likes, comments)
// Uses Prisma for database operations and Node.js fs module for file system checks

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  
  constructor(private prisma: PrismaService) {}

  // Save image metadata to database after file upload (called by controller)
  create(data: { filename: string; originalName?: string; url: string; description?: string; uploaderId: number }) {
    return this.prisma.image.create({ data }); 
  }

  // Get paginated images with search - filters out missing files and includes related data
  async findAll(search?: string, page: number = 1, limit: number = 10) {
    const trimmed = (search || '').trim();

    const whereClause = trimmed
      ? {
          OR: [
            { description: { contains: trimmed, mode: 'insensitive' as const } },
            { comments: { some: { text: { contains: trimmed, mode: 'insensitive' as const } } } },
          ],
        }
      : undefined;

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination metadata
    const totalCount = await this.prisma.image.count({
      where: whereClause,
    });

    const allImages = await this.prisma.image.findMany({
      where: whereClause,
      include: { 
        comments: { 
          include: { user: { select: { id: true, username: true } } } 
        },
        uploader: { select: { id: true, username: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    const validImages = allImages.filter(img => {
      const filePath = path.join(uploadsDir, img.filename);
      return fs.existsSync(filePath);
    });

    // Return paginated response with metadata
    return {
      data: validImages,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Increment image like count - uses Prisma's atomic increment to prevent race conditions
  like(id: number) {
    return this.prisma.image.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  // Decrement image like count - uses Prisma's atomic decrement
  unlike(id: number) {
    return this.prisma.image.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    });
  }

  // Add new comment to an image - creates Comment record linked to Image and User
  comment(imageId: number, text: string, userId: number) {
    return this.prisma.comment.create({
      data: { imageId, text, userId },
    });
  }

  // Delete image record and file - removes both database entry and physical file
  async delete(id: number) {
    this.logger.debug(`Attempting to delete image with ID: ${id}`);
    
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      this.logger.warn(`Image with ID ${id} not found`);
      throw new Error('Image not found');
    }

    this.logger.debug(`Found image: ${image.filename}`);

    // Remove physical file from uploads directory
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, image.filename);
    
    this.logger.debug(`Checking file path: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.debug(`Deleted file: ${filePath}`);
    } else {
      this.logger.warn(`File not found: ${filePath}`);
    }

    const result = await this.prisma.image.delete({
      where: { id },
    });
    
    this.logger.debug(`Deleted from database: ${result.id}`);
    return result;
  }
}