import { Movie } from "./movie";

export class PageInfo {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export class MovieList {
    paging: PageInfo;
    items: Movie[];
}