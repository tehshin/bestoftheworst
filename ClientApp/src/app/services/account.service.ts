import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subject, Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService extends HttpService {

    private isLoginVisibleSource: Subject<boolean> = new Subject<boolean>();
    isLoginVisible$: Observable<boolean> = this.isLoginVisibleSource.asObservable();

    get isAuthenticated(): boolean {
        return this.authService.hasValidAccessToken();
    }

    get accessToken(): string {
        return this.authService.getAccessToken();
    }

    private _user: IProfileModel;
    get user(): IProfileModel | undefined {
        if (!this._user) {
            const idToken: string = this.authService.getIdToken();
            if (idToken) {
                const jwtHelperService: JwtHelperService = new JwtHelperService();
                this._user = jwtHelperService.decodeToken(idToken);
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
    showLogin(): void {
        this.isLoginVisibleSource.next(true);
    }

    /**
     * Hide the login dialog
     */
    hideLogin(): void {
        this.isLoginVisibleSource.next(false);
    }

    isUserInRole(role: string): boolean {
        if (!this.isAuthenticated || !this.user) {
            return false;
        }

        if (this.user.role instanceof Array) {
            return (<Array<string>>this.user.role).filter((r: string) => r === role).length > 0;
        } else {
            return this.user.role === role;
        }
    }
}
