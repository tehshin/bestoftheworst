import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

export interface QueryParams {
  [key: string]: string;
}

@Injectable()
export class HttpService {

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    observe: 'response'
  };

  protected httpClient: HttpClient;
  protected baseUrl: string = '/api'

  constructor(
    httpClient: HttpClient,
    baseUrl: string
  ) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  private handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorObj: any = {
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
  }

  /**
   * Construct a GET request which returns the result as the given type
   * 
   * @return an `Observable` of the body as type `T`.
   */
  protected get<T>(url?: string, queryParams?: QueryParams): Observable<T> {
    const requestUrl: string = url ? `${this.baseUrl}/${url}` : this.baseUrl;
    this.httpOptions.params = queryParams;
    return this.httpClient.get<T>(requestUrl, this.httpOptions)
      .pipe(
        catchError(this.handleHttpError),
        map((response: HttpResponse<T>) => response.body)
      );
  }

  /**
   * Construct a POST request which returns the result as the given type
   * 
   * @return an `Observable` of the body as type `T`.
   */
  protected post<T>(url: string, data: any): Observable<T> {
    return this.httpClient.post<T>(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleHttpError),
        map((response: HttpResponse<T>) => response.body)
      );
  }
}
