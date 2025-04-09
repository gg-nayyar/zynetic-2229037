import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    try{
      await this.$connect();
    }catch(e) {
      console.error(e);
    }
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Disconnected from database');
  }
}
