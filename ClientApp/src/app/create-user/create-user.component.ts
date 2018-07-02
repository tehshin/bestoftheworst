import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  email: string;
  username: string;

  constructor(
    private authService: OAuthService
  ) { }

  ngOnInit() {
  }

  join() {
    this.authService.initImplicitFlow(null, { email: this.email, username: this.username });
  }

}
