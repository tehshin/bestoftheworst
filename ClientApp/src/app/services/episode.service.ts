import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Episode } from '../models/episode';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService extends HttpService {

  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/episode');
  }

  listEpisodes(): Observable<Episode[]> {
    return this.get<Episode[]>();
  }

  getById(id: number): Observable<Episode> {
    return this.get<Episode>(`${id}`);
  }

  createEpisode(episode: Episode) : Observable<Episode> {
    return this.post<Episode>(this.baseUrl, episode);
  }
}
