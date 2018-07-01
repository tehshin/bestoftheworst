import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  private baseUrl = "/api/application";

  loginProviders: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  getAppData() {
    this.http.get(`${this.baseUrl}/data`).subscribe(
      (appData: any) => this.loginProviders.next(appData.loginProviders),
      error => console.log(error)
    );
  }
}
