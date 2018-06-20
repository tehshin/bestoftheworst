import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  baseUrl = '/api/tag';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  autocompleteSuggestions: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.message || 'Unable to retrieve data';
    return throwError(errorMsg);
  };

  autocomplete(q: string): void {
    let params = new HttpParams().set("term", q);

    this.http.get<string[]>(`${this.baseUrl}/autocomplete`, { params: params })
      .subscribe(
        (data) => this.autocompleteSuggestions.next(data),
        error => this.handleError(error)
      );
  }
}
