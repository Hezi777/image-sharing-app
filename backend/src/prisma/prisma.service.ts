// Prisma service - provides database access throughout the app
// Extends PrismaClient and manages connection lifecycle automatically

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Connect to database when NestJS module starts up
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect from database when NestJS module shuts down
  async onModuleDestroy() {
    await this.$disconnect();
  }
}