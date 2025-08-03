// Prisma service that manages database connections and provides ORM functionality
// Handles database connection lifecycle and provides access to Prisma Client

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Service for managing Prisma database connections and ORM operations
// Implements lifecycle hooks to properly connect and disconnect from the database
// 
// This service extends PrismaClient to provide all database operations
// while managing the connection lifecycle automatically
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Lifecycle hook called when the module is initialized
  // Establishes connection to the database using Prisma Client
  async onModuleInit() {
    await this.$connect();
  }

  // Lifecycle hook called when the module is being destroyed
  // Properly disconnects from the database to prevent connection leaks
  async onModuleDestroy() {
    await this.$disconnect();
  }
}