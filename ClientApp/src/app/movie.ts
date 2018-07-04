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

export class Movie {
    id: number;
    title: string;
    synopsis: string;
    image?: Image;
    episode?: Episode;
    tags: Array<Tag> = [];
    links: Array<Link> = [];
}

export class MovieForm {
    title: string;
    synopsis: string;
    image: string;
    episodeId: number;
    tags: string[] = [];
    links: Link[] = [];

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