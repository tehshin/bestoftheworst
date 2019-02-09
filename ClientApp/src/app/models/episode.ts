/**
 * Represents a Best of the Worst Episode
 */
export class Episode {
    id: number;
    title: string;
    videoId: string;
    releaseDate: string;

    constructor(data?: Partial<Episode>) {
        Object.assign(this, data);
    }
}
