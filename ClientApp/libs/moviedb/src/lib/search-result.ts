import { Movie } from "./movie";

export class SearchResult {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}
