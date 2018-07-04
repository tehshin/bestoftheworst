import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private baseUrl = '/api/user';

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
    private http: HttpClient
  ) { }

  showLogin() {
    this.isLoginVisibleSource.next(true);
  }

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
