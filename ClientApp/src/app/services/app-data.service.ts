import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService extends HttpService {

    private _loginProviders: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    loginProviders: Observable<string[]> = this._loginProviders.asObservable();

    constructor(httpClient: HttpClient) {
        super(httpClient, '/api/application');
    }

    /**
     * Loads global application data that can be accessed in observables available in this service
     */
    getAppData(): void {
        this.get<any>('data')
            .subscribe((appData: any) => this._loginProviders.next(appData.loginProviders));
    }
}
