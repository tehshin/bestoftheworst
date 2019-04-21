import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpService } from "@botw/core";
import { Observable } from "rxjs";
import { MovieDetails } from "./movie-details";
import { SearchResult } from "./search-result";

/**
 * Implements interface for TheMovieDb api.
 * Search movies and get movie details.
 */
@Injectable({
    providedIn: "root"
})
export class MovieService extends HttpService {
    constructor(httpClient: HttpClient) {
        super(httpClient, "https://api.themoviedb.org/3");
    }

    /**
     * Search movies from TheMovieDb.
     */
    searchMovie(query: string): Observable<SearchResult> {
        return this.get<SearchResult>(`search/movie`, {
            api_key: "", //environment.tmdb.apiKey,
            query: query
        });
    }

    /**
     * Gets movie details from TheMovieDb.
     */
    getMovieById(id: number): Observable<MovieDetails> {
        return this.get<MovieDetails>(`movie/${id}`, {
            api_key: "" //environment.tmdb.apiKey
        });
    }
}
