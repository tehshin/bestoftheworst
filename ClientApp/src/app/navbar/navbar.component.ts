import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppDataService } from '../services/app-data.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUrl: string;
  showUserDropdown: boolean = false;

  get userProfile(): IProfileModel {
    return this.accountService.user;
  }

  get isLoggedIn(): boolean {
    return this.accountService.isAuthenticated;
  }

  get showAddMovie(): boolean {
    return this.accountService.isUserInRole('Administrator');
  }

  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: OAuthService
  ) { 
    this.router.events.subscribe(
      (_: NavigationEnd) => this.currentUrl = _.url
    )
  }

  ngOnInit() { }

  showLoginDialog(title: string) {
    this.accountService.showLogin();
  }

  logout() {
    this.authService.logOut();
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

}
