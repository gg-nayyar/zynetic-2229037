import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { APIResponse } from 'types/api';

interface Book {
  id?: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  publishedDate: Date;
  userId?: number;
}

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('create')
  async create(@Body() bookData: Book): Promise<APIResponse<Book>> {
    const book = await this.booksService.create(bookData)
    return {
      message: 'Book created successfully',
      data: book,
    };
  }
  @Get(':id')
  async getBookById(@Param('id') id: number): Promise<APIResponse<Book>> {

    const bookData = await this.booksService.getBookById(id);
    if(bookData !== null) {
      return {
        message: 'Book found',
        data: bookData,
      }
    } else {
      return {
        error: 'Book not found',
      }
    }
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() bookData: Book,
  ): Promise<APIResponse<Book>> {
    const udpatedBookData = await this.booksService.updateBook(id, bookData);
    if(udpatedBookData !== null) {
      return {
        message: 'Book updated successfully',
        data: udpatedBookData,
      };
    } else {
      return {
        error: 'Book not found',
      };
    }
  }
  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<APIResponse<null>> {
    try{
      await this.booksService.deleteBook(id);
      return {
        message: "Book Deleted Successfully"
      }
    } catch {
      return {
        error: 'Book not found',
      };
    }
  }
}
