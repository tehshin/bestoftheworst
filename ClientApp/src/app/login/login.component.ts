import { Component, OnInit, OnDestroy } from '@angular/core';
import { faGoogle, faTwitter, faMicrosoft, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AppDataService } from '../services/app-data.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginProviders: string[] = [];
    isLoginDialogVisible: boolean = false;
    loginDialogTitle: string = 'Login';

    subscription: Subscription;

    faGoogle: object = faGoogle;
    faGithub: object = faGithub;
    faTwitter: object = faTwitter;
    faMicrosoft: object = faMicrosoft;

    loginProviderIcons: { [key: string]: object } = {
        'Google': this.faGoogle,
        'GitHub': this.faGithub,
        'Twitter': this.faTwitter,
        'Microsoft': this.faMicrosoft
    };

    constructor(
        private appDataService: AppDataService,
        private authService: OAuthService,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.appDataService.loginProviders.subscribe(
            (data: string[]) => this.loginProviders = data
        );

        this.subscription = this.accountService.isLoginVisible$.subscribe(
            (state: boolean) => this.isLoginDialogVisible = state
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    closeLoginDialog(): void {
        this.accountService.hideLogin();
    }

    loginProviderClass(loginProvider: string): string {
        return `is-${loginProvider.toLowerCase()}`;
    }

    redirect(provider: string): void {
        this.authService.initImplicitFlow(null, { provider: provider });
    }

}
