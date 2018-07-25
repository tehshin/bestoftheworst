
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MovieDbSearchResult } from './movie-db-search-result';

@Injectable({
  providedIn: 'root'
})
export class MovieDbService {

  private baseUrl = 'https://api.themoviedb.org/3/';
 
  constructor(
    private http: HttpClient
  ) { }

  private getHttpOptions() {
    const httpOptions = {
      params: new HttpParams().append("api_key", environment.tmdb.apiKey)
    }
    return httpOptions;
  }

  searchMovie(query: string) {
    const httpOptions = this.getHttpOptions();
    httpOptions.params = httpOptions.params.append('query', query);

    return this.http.get<MovieDbSearchResult>(`${this.baseUrl}search/movie`, httpOptions);
  }
}
