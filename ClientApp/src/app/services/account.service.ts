import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends HttpService {

  private isLoginVisibleSource = new Subject<boolean>();
  isLoginVisible$ = this.isLoginVisibleSource.asObservable();

  get isAuthenticated(): boolean {
    return this.authService.hasValidAccessToken();
  }

  get accessToken() {
    return this.authService.getAccessToken();
  }

  private _user: IProfileModel;
  get user(): IProfileModel | undefined {
    if (!this._user) {
      var idToken = this.authService.getIdToken();
      if (idToken) {
        const helper = new JwtHelperService();
        this._user = helper.decodeToken(idToken);
      }
    }
    return this._user;
  }

  constructor(
    private authService: OAuthService,
    httpClient: HttpClient
  ) { 
    super(httpClient, '/api/user');
  }

  /**
   * Show the login dialog
   */
  showLogin() {
    this.isLoginVisibleSource.next(true);
  }

  /**
   * Hide the login dialog
   */
  hideLogin() {
    this.isLoginVisibleSource.next(false);
  }

  isUserInRole(role: string): boolean {
    if (!this.isAuthenticated || !this.user)
      return false;

    if (this.user.role instanceof Array) {
      return (<Array<string>>this.user.role).filter(r => r === role).length > 0;
    } else {
      return this.user.role === role;
    }
  }
}
