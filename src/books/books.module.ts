import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [BooksController],
  providers: [BooksService, PrismaService],
  imports: [
      JwtModule.register({
        secret: 'process.env.JWT_SECRET',
      })
    ],
  exports: [PrismaService]
})
export class BooksModule {}
