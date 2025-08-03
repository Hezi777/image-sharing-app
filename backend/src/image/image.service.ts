// Image service that handles all image-related business logic and database operations
// Provides methods for creating, retrieving, and managing images and their metadata

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

// Service for managing image operations including database interactions and file validation
// Handles CRUD operations for images and their associated comments and likes
@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  // Create a new image record in the database
  // Stores metadata about the uploaded image including filename and URL
  create(data: { filename: string; originalName?: string; url: string }) {
    return this.prisma.image.create({ data });
  }

  // Retrieve all images from the database that still have valid files on disk
  // This method includes comments for each image and filters out images whose
  // files have been deleted from the uploads directory
  // 
  // Process:
  // 1. Fetch all images with their comments from the database
  // 2. Check if each image file still exists in the uploads directory
  // 3. Return only images with valid files
  async findAll() {
    // Fetch all image records along with their comments
    const allImages = await this.prisma.image.findMany({
      include: { comments: true },
    });

    // Determine the uploads directory path relative to the current file
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

    // Filter out any image whose file is missing from the uploads folder
    // This prevents broken image links in the frontend
    const validImages = allImages.filter(img => {
      const filePath = path.join(uploadsDir, img.filename);
      return fs.existsSync(filePath);
    });

    return validImages;
  }

  // Increment the like count for a specific image
  // Uses Prisma's atomic increment operation to ensure thread safety
  like(id: number) {
    return this.prisma.image.update({
      where: { id },
      data: { likes: { increment: 1 } }, // Atomic increment operation
    });
  }

  // Add a new comment to a specific image
  // Creates a comment record linked to the image via foreign key
  comment(imageId: number, text: string) {
    return this.prisma.comment.create({
      data: { imageId, text },
    });
  }
}