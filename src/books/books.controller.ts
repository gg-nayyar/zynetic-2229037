import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { APIResponse } from 'types/api';
import { Filter, Pagination, Sort } from 'types/book.types';

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

  @Get()
  async getAllBooks(@Query('filter') query: string | null, @Query('by') field: Filter | null, @Query('page') page: number | null, @Query('limit') limit: number | null, @Query('sort') sort: Sort | null): Promise<APIResponse<Book[]>> {
    console.log('Query:', query);
    const pagination: Pagination = {};
    if(page && limit) {
      pagination.pageNumber = Number(page);
      pagination.limitNumber = Number(limit);
      pagination.startIndex = (pagination.pageNumber - 1) * pagination.limitNumber;
    }
    if(query) {
      if(field) {
        const filteredBookData = await this.booksService.getAllBookWithFilter(query, field, pagination || null, sort || undefined);
        if(filteredBookData !== null) {
          return {
            message: 'Books found',
            data: filteredBookData,
          }
        }
        return {
          error: 'No books found',
        }
      
      } else {
        const filteredBookData = await this.booksService.getAllBookWithFilter(query, Filter.title, pagination || null, sort || undefined);
        if(filteredBookData !== null) {
          return {
            message: 'Books found',
            data: filteredBookData,
          }
        }
        return {
          error: 'No books found',
        }
      }
    }
    const bookData = await this.booksService.getAllBook(pagination || null, sort || undefined);
    if(bookData !== null) {
      console.log("wow")
      return {
        message: 'Books found',
        data: bookData,
      }
    }
    console.log("wow2")
    return {
      error: 'No books found',
    }
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() bookData: Book,
  ): Promise<APIResponse<Book>> {
    console.log("hwwwwwwwww",id)
    // const Id = parseInt(id);
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
