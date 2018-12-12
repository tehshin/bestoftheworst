import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MovieForm } from '../models/movie-form';
import { MovieList } from '../models/movie-list';
import { HttpService, QueryParams } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends HttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/movie');
  }

  listMovies(pageIndex: number, pageSize: number, query: string) {
    const queryParams: QueryParams = {};

    if (pageIndex) queryParams.page = pageIndex;
    if (pageSize) queryParams.pageSize = pageSize;
    if (query) queryParams.query = query;

    return this.get<MovieList>('', queryParams);
  };

  getById(id: number): Observable<Movie> {
    return this.get<Movie>(`${id}`)
      .pipe(
        map((movieDto:Movie) => new Movie(movieDto))
      );
  };

  createMovie(movie: MovieForm): Observable<Movie> {
    return this.post<Movie>(this.baseUrl, movie);
  };

  updateMovie(id: number, movie: MovieForm): Observable<{}> {
    return this.put('${id}', movie);
  };

  deleteMovie(id: number): void {
    this.delete(`${id}`);
  };
}
