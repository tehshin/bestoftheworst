import { Link } from "./link";
import { Episode } from "./episode";

export class Image {
    id: string;
    imageUrls: {[key: number]: string};
}

export class Tag {
    id: number;
    name: string;
}

export class Genre {
    id: number;
    name: string;
}

export class Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    synopsis: string;
    runtime: number;
    image?: Image;
    episode?: Episode;
    tags: Array<Tag> = [];
    links: Array<Link> = [];
    genres: Array<Genre> = [];
}

export class MovieForm {
    title: string;
    overview: string;
    synopsis: string;
    release_date: string;
    runtime: number;
    image: string;
    episodeId: number;
    tags: string[] = [];
    links: Link[] = [];
    genres: Genre[] = [];

    public constructor(init?: Partial<MovieForm>) {
        Object.assign(this, init);
    }
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