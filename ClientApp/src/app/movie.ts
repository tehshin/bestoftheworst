import { Link } from "./link";
import { Episode } from "./episode";
import { Genre } from "./genre";

export class Image {
    id: string;
    imageUrls: {[key: number]: string};
}

export class Tag {
    id: number;
    name: string;
}

export class Movie {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
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
    releaseDate: string;
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