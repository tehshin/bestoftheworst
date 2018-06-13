import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Movie, MovieForm } from './movie'
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  baseUrl = '/api/movie';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.message || 'Unable to retrieve data';
    return throwError(errorMsg);
  };

  listMovies() {
    return this.http.get<Movie[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      )
  };

  getById(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Movie>(url)
      .pipe(
        catchError(this.handleError)
      );
  };

  createMovie(movie: MovieForm): Observable<Movie> {
    return this.http.post<Movie>(this.baseUrl, movie, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  };

  updateMovie(id: number, movie: MovieForm): Observable<{}> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, movie, this.httpOptions)
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
