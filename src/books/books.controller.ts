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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

class Book {
  id?: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  publishedDate: Date;
  userId?: number;
}

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: Book })
  @ApiResponse({ status: 201, description: 'Book created successfully', type: Book })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() bookData: Book): Promise<APIResponse<Book>> {
    const book = await this.booksService.create(bookData);
    return {
      message: 'Book created successfully',
      data: book,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Book found', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: number): Promise<APIResponse<Book>> {
    const bookData = await this.booksService.getBookById(id);
    if (bookData !== null) {
      return {
        message: 'Book found',
        data: bookData,
      };
    } else {
      return {
        error: 'Book not found',
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with optional filters, pagination, and sorting' })
  @ApiQuery({ name: 'filter', required: false, type: String, description: 'Filter query' })
  @ApiQuery({ name: 'by', required: false, enum: Filter, description: 'Field to filter by' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit for pagination' })
  @ApiQuery({ name: 'sort', required: false, enum: Sort, description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully', type: [Book] })
  @ApiResponse({ status: 404, description: 'No books found' })
  async getAllBooks(
    @Query('filter') query: string | null,
    @Query('by') field: Filter | null,
    @Query('page') page: number | null,
    @Query('limit') limit: number | null,
    @Query('sort') sort: Sort | null,
  ): Promise<APIResponse<Book[]>> {
    const pagination: Pagination = {};
    if (page && limit) {
      pagination.pageNumber = Number(page);
      pagination.limitNumber = Number(limit);
      pagination.startIndex = (pagination.pageNumber - 1) * pagination.limitNumber;
    }
    if (query) {
      if (field) {
        const filteredBookData = await this.booksService.getAllBookWithFilter(query, field, pagination || null, sort || undefined);
        if (filteredBookData !== null) {
          return {
            message: 'Books found',
            data: filteredBookData,
          };
        }
        return {
          error: 'No books found',
        };
      } else {
        const filteredBookData = await this.booksService.getAllBookWithFilter(query, Filter.title, pagination || null, sort || undefined);
        if (filteredBookData !== null) {
          return {
            message: 'Books found',
            data: filteredBookData,
          };
        }
        return {
          error: 'No books found',
        };
      }
    }
    const bookData = await this.booksService.getAllBook(pagination || null, sort || undefined);
    if (bookData !== null) {
      return {
        message: 'Books found',
        data: bookData,
      };
    }
    return {
      error: 'No books found',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing book by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the book' })
  @ApiBody({ type: Book })
  @ApiResponse({ status: 200, description: 'Book updated successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateBook(
    @Param('id') id: string,
    @Body() bookData: Book,
  ): Promise<APIResponse<Book>> {
    const updatedBookData = await this.booksService.updateBook(id, bookData);
    if (updatedBookData !== null) {
      return {
        message: 'Book updated successfully',
        data: updatedBookData,
      };
    } else {
      return {
        error: 'Book not found',
      };
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'The ID of the book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('id') id: number): Promise<APIResponse<null>> {
    try {
      await this.booksService.deleteBook(id);
      return {
        message: 'Book Deleted Successfully',
      };
    } catch {
      return {
        error: 'Book not found',
      };
    }
  }
}
