import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MovieForm } from '../models/movie-form';
import { MovieList } from '../models/movie-list';
import { HttpService, QueryParams } from './http.service';
import { EpisodeGroup } from '../models/episode-group';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends HttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/movie');
  }

  /**
   * Returns a paged list of movies.
   * @param pageIndex Index of the page
   * @param pageSize Size of the page
   * @param query Query string to filter movies
   */
  listMovies(pageIndex: number, pageSize: number, query: string): Observable<MovieList> {
    const queryParams: QueryParams = {};

    if (pageIndex) queryParams.page = pageIndex;
    if (pageSize) queryParams.pageSize = pageSize;
    if (query) queryParams.query = query;

    return this.get<MovieList>('', queryParams);
  };

  /**
   * Returns a list of the latest movies grouped by episode and sorted
   * by episode release date.
   */
  listLatestMoviesGroupedByEpisode(): Observable<EpisodeGroup[]> {
    return this.get<EpisodeGroup[]>('latest');
  }

  /**
   * Returns a movie by id.
   * @param id Id of the Movie
   */
  getById(id: number): Observable<Movie> {
    return this.get<Movie>(`${id}`)
      .pipe(
        map((movieDto:Movie) => new Movie(movieDto))
      );
  };

  /**
   * Creates a movie.
   * @param movie Movie to create
   */
  createMovie(movie: MovieForm): Observable<Movie> {
    return this.post<Movie>(this.baseUrl, movie);
  };

  /**
   * Updates a movie by id.
   * @param id Id of the movie
   * @param movie Updated movie data
   */
  updateMovie(id: number, movie: MovieForm): Observable<{}> {
    return this.put('${id}', movie);
  };

  /**
   * Delets a movie by id.
   * @param id Id of the movie
   */
  deleteMovie(id: number): void {
    this.delete(`${id}`);
  };
}
