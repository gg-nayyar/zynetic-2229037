import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { SignInMiddleware } from 'middlewares/checkSignedIn.middleware';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { BooksModule } from './books/books.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    BooksModule,
    AuthModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  exports: [PrismaService],
  providers: [AppService, PrismaService, SignInMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignInMiddleware).forRoutes('books');
  }
}
