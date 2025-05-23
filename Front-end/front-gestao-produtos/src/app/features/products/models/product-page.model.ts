import { Product } from './product.model';

export interface PageableObject {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortObject;
  unpaged: boolean;
}

export interface SortObject {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface ProductPage {
  totalPages: number;
  totalElements: number;
  pageable: PageableObject;
  size: number;
  content: Product[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  sort: SortObject;
  empty: boolean;
}
