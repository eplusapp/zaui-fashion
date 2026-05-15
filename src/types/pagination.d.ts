export interface Pagination {
  total_data: number;
  total_page: number;
  page: number;
  limit: number;
}
export interface Pagination {
  total_data: number;
  total_page: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  paginate: Pagination;
}