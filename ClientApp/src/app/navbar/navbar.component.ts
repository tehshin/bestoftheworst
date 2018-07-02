import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { faGoogle, faTwitter, faMicrosoft, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AppDataService } from '../app-data.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loginProviders = [];

  currentUrl: string;
  isLoginDialogVisible: boolean = false;
  loginDialogTitle: string = "Login";

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
    private router: Router,
    private appDataService: AppDataService,
    private authService: OAuthService
  ) { 
    router.events.subscribe(
      (_: NavigationEnd) => this.currentUrl = _.url
    )
  }

  ngOnInit() {
    this.appDataService.loginProviders.subscribe(
      data => this.loginProviders = data
    );
  }

  closeLoginDialog() {
    this.isLoginDialogVisible = false;
  }

  showLoginDialog(title: string) {
    this.loginDialogTitle = title;
    this.isLoginDialogVisible = true;
  }

  loginProviderClass(loginProvider: string) {
    return `is-${loginProvider.toLowerCase()}`;
  }

  redirect(provider: string) {
    this.authService.initImplicitFlow(null, { provider: provider });
  }

}
