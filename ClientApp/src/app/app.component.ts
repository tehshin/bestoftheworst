import { Component, OnInit } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Best of the Worst';

  constructor(
    private oAuthService: OAuthService,
    private activatedRotue: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { 
    this.configureAuth();
  }

  ngOnInit() {
    this.activatedRotue.queryParams.subscribe(
      (params: Params) => {
        const loginStatus = params["loginstatus"];
        if (loginStatus == "2") {
          this.router.navigate(['users/join']);
        }
      }
    );

    if (this.accountService.isAuthenticated) {
      this.accountService.getUserInfo();
    }
  }

  configureAuth() {
    let baseUrl = window.location.origin;
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    this.oAuthService.configure(authConfig(baseUrl));
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();

    this.oAuthService.events
      .pipe(
        filter(e => e.type === 'token_received'))
      .subscribe(
        e => this.accountService.getUserInfo()
      );
  }
}
