import { Component } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Best of the Worst';

  constructor(
    private oAuthService: OAuthService
  ) { 
    this.configureAuth();
  }

  configureAuth() {
    let baseUrl = window.location.origin;
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    
    this.oAuthService.configure(authConfig(baseUrl));
    this.oAuthService.setStorage(localStorage);
    this.oAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }
}
