import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// Business logic layer for image uploads, queries, likes, and comments
@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  // Save new image metadata to the database
  create(data: { filename: string; originalName?: string; url: string; description?: string; uploaderId: number }) {
    return this.prisma.image.create({ data }); 
  }

  // Fetch all images that still have matching files in /uploads
  //  - Includes comments and user information
  //  - Supports optional text search across description and comment text
  //  - Filters out missing or deleted files
  async findAll(search?: string) {
    const trimmed = (search || '').trim();

    const whereClause = trimmed
      ? {
          OR: [
            { description: { contains: trimmed, mode: 'insensitive' as const } },
            { comments: { some: { text: { contains: trimmed, mode: 'insensitive' as const } } } },
          ],
        }
      : undefined;

    const allImages = await this.prisma.image.findMany({
      where: whereClause,
      include: { 
        comments: { 
          include: { user: { select: { id: true, username: true } } } 
        },
        uploader: { select: { id: true, username: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    const validImages = allImages.filter(img => {
      const filePath = path.join(uploadsDir, img.filename);
      return fs.existsSync(filePath);
    });

    return validImages;
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
    console.log(`Attempting to delete image with ID: ${id}`);
    
    // Get image info to delete the file
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      console.log(`Image with ID ${id} not found`);
      throw new Error('Image not found');
    }

    console.log(`Found image: ${image.filename}`);

    // Delete the file from filesystem
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, image.filename);
    
    console.log(`Checking file path: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }

    // Delete from database
    const result = await this.prisma.image.delete({
      where: { id },
    });
    
    console.log(`Deleted from database: ${result.id}`);
    return result;
  }
}