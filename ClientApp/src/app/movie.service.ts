import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Movie } from './models/movie'
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MovieList } from './models/movie-list';
import { MovieForm } from './models/movie-form';

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
    let errorObj = {
      message: "",
      notfound: false
    };

    if (error.error instanceof ErrorEvent) {
      errorObj.message = error.error.message;
    } else if (error.status == 404) {
      errorObj.message = "API returned 404 not found";
      errorObj.notfound = true;
    } else {
      errorObj.message = error.message || 'Unable to retrieve data';
    }

    return throwError(errorObj);
  };

  listMovies(pageIndex: number, pageSize: number, query: string) {
    let params: HttpParams;
    
    if (pageIndex || pageSize) {
      params = new HttpParams();
      params = pageIndex ? params.append('page', pageIndex.toString()) : params;
      params = pageSize ? params.append('pageSize', pageSize.toString()) : params;
    }

    if (query) {
      params = params || new HttpParams();
      params = params.append('query', query);
    }
    
    return this.http.get<MovieList>(this.baseUrl, { params: params })
      .pipe(
        catchError(this.handleError)
      )
  };

  getById(id: number): Observable<Movie> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Movie>(url)
      .pipe(
        map((movieDto:Movie) => new Movie(movieDto)),
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
