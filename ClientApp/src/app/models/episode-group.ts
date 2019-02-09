import { Episode } from './episode';
import { Movie } from './movie';

/**
 * Represents a list of Movies grouped by Episode
 *
 * @see Episode
 * @see Movie
 */
export class EpisodeGroup {
    episode: Episode;
    movies: Movie[];

    constructor(data?: Partial<EpisodeGroup>) {
        Object.assign(this, data);
    }
}
