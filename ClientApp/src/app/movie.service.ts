import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Movie, MovieForm, MovieList } from './movie'
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  listMovies(pageIndex: number, pageSize: number) {
    let params: HttpParams;
    
    if (pageIndex || pageSize) {
      params = new HttpParams();
      params = pageIndex ? params.append('page', pageIndex.toString()) : params;
      params = pageSize ? params.append('pageSize', pageSize.toString()) : params;
    }
    
    return this.http.get<MovieList>(this.baseUrl, { params: params })
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
