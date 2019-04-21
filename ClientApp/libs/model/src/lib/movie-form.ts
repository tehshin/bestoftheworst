import { Link } from './link';
import { Genre } from './genre';

export class MovieForm {
    title: string;
    overview: string;
    synopsis: string;
    releaseDate: string;
    runtime: number;
    placement: number;
    image: string;
    episodeId: number;
    tags: string[] = [];
    links: Link[] = [];
    genres: Genre[] = [];

    public constructor(init?: Partial<MovieForm>) {
        Object.assign(this, init);
    }
}
