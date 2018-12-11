import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MovieDbSearchResult, MovieDbDetails } from '../models/movie-db-search-result';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieDbService extends HttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'https://api.themoviedb.org/3');
  }

  /**
   * Search movies from TheMovieDb
   */
  searchMovie(query: string): Observable<MovieDbSearchResult> {
    return this.get<MovieDbSearchResult>(`search/movie`, {
      'api_key': environment.tmdb.apiKey,
      'query': query
    });
  }

  /**
   * Gets movie details from TheMovieDb
   */
  getMovieById(id: number): Observable<MovieDbDetails> {
    return this.get<MovieDbDetails>(`movie/${id}`, {
      'api_key': environment.tmdb.apiKey
    });
  }
}
