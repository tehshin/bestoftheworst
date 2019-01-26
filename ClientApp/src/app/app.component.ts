import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from './services/account.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title: string = 'Best of the Worst';

    constructor(
        private oAuthService: OAuthService,
        private activatedRotue: ActivatedRoute,
        private router: Router
    ) {
        this.configureAuth();
    }

    ngOnInit(): void {
        this.activatedRotue.queryParams.subscribe(
            (params: Params) => {
                const loginStatus: string = params['loginstatus'];
                if (loginStatus === '2') {
                    this.router.navigate(['users/join']);
                }
            }
        );
    }

    configureAuth(): void {
        let baseUrl: string = window.location.origin;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        this.oAuthService.configure(authConfig(baseUrl));
        this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
        this.oAuthService.loadDiscoveryDocumentAndTryLogin();
    }
}
