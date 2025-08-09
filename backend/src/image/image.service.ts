import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// Business logic layer for image uploads, queries, likes, and comments
@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);
  
  constructor(private prisma: PrismaService) {}

  // Save new image metadata to the database
  create(data: { filename: string; originalName?: string; url: string; description?: string; uploaderId: number }) {
    return this.prisma.image.create({ data }); 
  }

  // Fetch all images that still have matching files in /uploads
  //  - Includes comments and user information
  //  - Supports optional text search across description and comment text
  //  - Filters out missing or deleted files
  //  - Supports pagination with page and limit parameters
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

  // Atomically increment like count for given image ID
  like(id: number) {
    return this.prisma.image.update({
      where: { id },
      data: { likes: { increment: 1 } }, // Atomic increment operation
    });
  }

  // Atomically decrement like count for given image ID
  unlike(id: number) {
    return this.prisma.image.update({
      where: { id },
      data: { likes: { decrement: 1 } }, // Atomic decrement operation
    });
  }

  // Create a new comment linked to a specific image
  comment(imageId: number, text: string, userId: number) {
    return this.prisma.comment.create({
      data: { imageId, text, userId },
    });
  }

  // Delete an image and its file
  async delete(id: number) {
    this.logger.debug(`Attempting to delete image with ID: ${id}`);
    
    // Get image info to delete the file
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      this.logger.warn(`Image with ID ${id} not found`);
      throw new Error('Image not found');
    }

    this.logger.debug(`Found image: ${image.filename}`);

    // Delete the file from filesystem
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, image.filename);
    
    this.logger.debug(`Checking file path: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.debug(`Deleted file: ${filePath}`);
    } else {
      this.logger.warn(`File not found: ${filePath}`);
    }

    // Delete from database
    const result = await this.prisma.image.delete({
      where: { id },
    });
    
    this.logger.debug(`Deleted from database: ${result.id}`);
    return result;
  }
}