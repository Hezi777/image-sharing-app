// Root NestJS module - wires together all app features (auth, images, database)
// Uses dependency injection to connect controllers, services, and database

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env variables
    PrismaModule,           // Database connection
    ImageModule,            // Image upload/management
    AuthModule,             // User login/registration
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
