import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SignInMiddleware } from 'middlewares/checkSignedIn.middleware';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [AuthModule, UsersModule, BooksModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInMiddleware).forRoutes('books');
  }
}
