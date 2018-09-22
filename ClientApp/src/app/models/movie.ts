import { Link } from "./link";
import { Episode } from "./episode";
import { Genre } from "./genre";
import { Image } from "./image";
import { Tag } from "./tag";

export class Movie {
    id: number;
    title: string;
    overview: string;
    releaseDate: string;
    synopsis: string;
    runtime: number;
    placement: number;
    image?: Image;
    episode?: Episode;
    tags: Array<Tag> = [];
    links: Array<Link> = [];
    genres: Array<Genre> = [];

    constructor(data?:Partial<Movie>) {
        Object.assign(this, data);
    }

    getReleaseYear(): string {
        return this.releaseDate ? this.releaseDate.split('-').shift() : null;
    }

    getGenreNames(): string {
        return this.genres.map((genre:Genre) => genre.name).join(", ");
    }
}
