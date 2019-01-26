import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class TagService extends HttpService {

    private _autocompleteSuggestions$: BehaviorSubject<string[]> = new BehaviorSubject([]);
    autocompleteSuggestions$: Observable<string[]> = this._autocompleteSuggestions$.asObservable();

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/tag');
    }

    /**
     * Trigger a search request that will update the `autocompleteSuggestions$` observable
     */
    autocomplete(q: string): void {
        this.get<string[]>(`${this.baseUrl}/autocomplete`, { 'term': q })
            .subscribe((data: string[]) => this._autocompleteSuggestions$.next(data));
    }
}
