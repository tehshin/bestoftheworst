import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Movie } from '../models/movie'
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MovieList } from '../models/movie-list';
import { MovieForm } from '../models/movie-form';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends HttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/movie');
  }

  listMovies(pageIndex: number, pageSize: number, query: string) {
    let params: HttpParams;

    return this.get<MovieList>('', {
      page: pageIndex ? pageIndex.toString() : null,
      pageSize: pageSize ? pageSize.toString() : null,
      query
    });
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
    const url = `${this.baseUrl}/`;
    return this.put('${id}', movie)
      .pipe(
        catchError(this.handleError)
      );
  };

  deleteMovie(id: number): Observable<{}> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  };
}
