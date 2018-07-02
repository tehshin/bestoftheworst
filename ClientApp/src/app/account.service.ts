import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = '/api/user';

  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  get isAuthenticated(): boolean {
    return this.authService.hasValidAccessToken();
  }

  get accessToken() {
    return this.authService.getAccessToken();
  }

  constructor(
    private authService: OAuthService,
    private http: HttpClient
  ) { }

  getUserInfo() {
    this.http.get(`${this.baseUrl}/info`)
      .subscribe(
        (userInfo) => this.currentUser.next(userInfo),
        error => console.log(error)
      );
  }
}
