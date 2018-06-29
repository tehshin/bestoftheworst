import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  loginProviders: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  getAppData() {
    // TODO: load app data and set loginProviders
  }
}
