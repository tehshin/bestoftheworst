import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private accountService: AccountService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const expectedRole: any = route.data.expectedRole;
        const user: IProfileModel = this.accountService.user;

        if (!this.accountService.isAuthenticated || !user || !this.accountService.isUserInRole(expectedRole)) {
            this.router.navigate(['']);
            this.accountService.showLogin();
            return false;
        }

        return true;
    }
}
