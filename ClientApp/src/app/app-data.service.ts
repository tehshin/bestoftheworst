import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  private baseUrl = "/api/application";

  loginProviders = [];

  constructor(
    private http: HttpClient
  ) { }

  getAppData() {
    this.http.get(`${this.baseUrl}/data`).subscribe(
      (appData: any) => this.loginProviders = appData ? appData.loginProviders : [],
      error => console.log(error)
    );
  }
}
