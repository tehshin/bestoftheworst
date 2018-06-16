export class Image {
    id: string;
    imageUrl: string;
}

export class Movie {
    id: number;
    title: string;
    synopsis: string;
    image: Image;
}

export class MovieForm {
    title: string;
    synopsis: string;
    image: string;
    tags: string[] = [];
}

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