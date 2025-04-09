import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Filter, Pagination, Sort } from '../types/book.types';

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


@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(bookData: Book): Promise<Book> {
    const bookDataWithoutId: Omit<Book, 'id'> = {
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      price: bookData.price,
      rating: bookData.rating,
      publishedDate: bookData.publishedDate,
    };
    await this.prisma.book.create({
      data: bookDataWithoutId,
    });
    return bookData;
  }

  async getAllBook(pagination?: Pagination, sort?: Sort): Promise<Book[] | null> {
    if(pagination) {
      const { limitNumber, startIndex } = pagination;
      let filter_options: {
        skip: number;
        take: number;
        orderBy?: {
          [key: string]: 'asc' | 'desc';
        };
      } = {
        skip: startIndex || 0,
        take: limitNumber || 10,
      };
      if(sort) {
        filter_options = {
          ...filter_options,
          orderBy: {
            [sort]: 'asc',
          },
        };
      }
      const bookData = await this.prisma.book.findMany(filter_options);
      if(bookData) {
        return bookData;
      } else {
        return null;
      }
    } else {
      let filter_options = {};
      if(sort) {
        filter_options = {
          ...filter_options,
          orderBy: {
            [sort]: 'asc',
          },
        };
      }
      const bookData = await this.prisma.book.findMany(filter_options);
      if(bookData) {
        return bookData;
      } else {
        return null;
      }
    }
  }

  async getAllBookWithFilter(query: string, filter: Filter, pagination?: Pagination, sort?: Sort): Promise<Book[] | null> {
    if(pagination) {
      const { limitNumber, startIndex } = pagination;
      let filter_options: {
        where: {
          [key: string]: {
            contains: string;
          };
        };
        skip: number;
        take: number;
        orderBy?: {
          [key: string]: 'asc' | 'desc';
        };
      } = {
        where: {
          [filter]: {
            contains: query,
          },
        },
        skip: startIndex || 0,
        take: limitNumber || 10,
      };
      if(sort) {
        filter_options = {
          ...filter_options,
          orderBy: {
            [sort]: 'asc',
          },
        };
      }
      const bookData = await this.prisma.book.findMany(filter_options);
      if(bookData) {
        return bookData;
      } else {
        return null;
      }
    } else {
      const filter_options: {
        where: {
          [key: string]: {
            contains: string;
          };
        };
        orderBy?: {
          [key: string]: 'asc' | 'desc';
        };
      } = {
        where: {
          [filter]: {
            contains: query,
          },
        },
      };
      if(sort) {
        filter_options.orderBy = {
          [sort]: 'asc',
        };
      }
      const bookData = await this.prisma.book.findMany(filter_options);
      if(bookData) {
        return bookData;
      } else {
        return null;
      }
    }
  }

  async getBookById(id: number): Promise<Book | null> {
    const bookData = await this.prisma.book.findUnique({
      where: { id: `${id}` },
    });
    if(bookData) {
      return bookData;
    } else {
      return null
    }
  }

  async updateBook(id: number, bookData: Book): Promise<Book | null> {
    try {
      const updatedBook = await this.prisma.book.update({
        where: { id: `${id}` },
        data: bookData,
      });

      return updatedBook;
    } catch {
      return null;
    }
  }

  async deleteBook(id: number): Promise<null> {
    try {
      await this.prisma.book.delete({
        where: { id: `${id}` },
      });
      return null;
    } catch {
      throw new Error('Book not found');
    }
  }
}
