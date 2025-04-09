export enum Filter {
  title = 'title',
  author = 'author',
  category = 'category',
  price = 'price',
  rating = 'rating',
  publishedDate = 'publishedDate',
}

export type Pagination = {
    pageNumber?: number;
    limitNumber?: number;
    startIndex?: number;
} 

export enum Sort {
    price = 'price',
    rating = 'rating',
}