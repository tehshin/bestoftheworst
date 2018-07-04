import { Component, OnInit, OnDestroy } from '@angular/core';
import { faGoogle, faTwitter, faMicrosoft, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AppDataService } from '../app-data.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from '../account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginProviders = [];
  isLoginDialogVisible: boolean = false;
  loginDialogTitle: string = "Login";

  subscription: Subscription;

  faGoogle = faGoogle;
  faGithub = faGithub;
  faTwitter = faTwitter;
  faMicrosoft = faMicrosoft;

  loginProviderIcons = {
    "Google": this.faGoogle,
    "GitHub": this.faGithub,
    "Twitter": this.faTwitter,
    "Microsoft": this.faMicrosoft
  };

  constructor(
    private appDataService: AppDataService,
    private authService: OAuthService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.appDataService.loginProviders.subscribe(
      data => this.loginProviders = data
    );

    this.subscription = this.accountService.isLoginVisible$.subscribe(
      state => this.isLoginDialogVisible = state
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeLoginDialog() {
    this.accountService.hideLogin();
  }

  loginProviderClass(loginProvider: string) {
    return `is-${loginProvider.toLowerCase()}`;
  }

  redirect(provider: string) {
    this.authService.initImplicitFlow(null, { provider: provider });
  }

}
