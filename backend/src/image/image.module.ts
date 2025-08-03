import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 import it

@Module({
  imports: [PrismaModule],
  providers: [ImageService],
  controllers: [ImageController]
})
export class ImageModule {}
