import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { faGoogle, faTwitter, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUrl: string;
  isLoginDialogVisible: boolean = false;
  loginDialogTitle: string = "Login";

  faGoogle = faGoogle;
  faTwitter = faTwitter;
  faMicrosoft = faMicrosoft;

  constructor(
    private router: Router
  ) { 
    router.events.subscribe(
      (_: NavigationEnd) => this.currentUrl = _.url
    )
  }

  ngOnInit() {
  }

  closeLoginDialog() {
    this.isLoginDialogVisible = false;
  }

  showLoginDialog(title: string) {
    this.loginDialogTitle = title;
    this.isLoginDialogVisible = true;
  }

}
