import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { Episode } from './models/episode';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  baseUrl = "/api/episode";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.message || 'Unable to retrieve data';
    return throwError(errorMsg);
  }

  listEpisodes() {
    return this.http.get<Episode[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Episode>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createEpisode(episode: Episode) : Observable<Episode> {
    return this.http.post<Episode>(this.baseUrl, episode, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
