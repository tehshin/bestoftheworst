import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from './account.service';


class OAuthServiceStub {
    _hasValidAccessToken: boolean = true;
    _accessToken: string = 'token';
    _idToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbInJvbGUiXX0.CPv8v9h0A1yWpJ_KWtCq0l8IT-pT8tbfHIIn1vT1juU';

    hasValidAccessToken(): boolean {
        return this._hasValidAccessToken;
    }

    getAccessToken(): string {
        return this._accessToken;
    }

    getIdToken(): string {
        return this._idToken;
    }
}

describe('AccountService', () => {
    let service: AccountService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                AccountService,
                {
                    provide: OAuthService,
                    useClass: OAuthServiceStub
                }
            ]
        });
    });

    beforeEach(() => {
        service = TestBed.get(AccountService);
    });

    test('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('.showLogin', () => {
        test('should set login to visible', () => {
            let loginVisible: boolean = false;
            service.isLoginVisible$.subscribe((isVisible: boolean) => {
                loginVisible = isVisible;
            });
            service.showLogin();
            expect(loginVisible).toBe(true);
        });
    });

    describe('.hideLogin', () => {
        test('should set login to not visible', () => {
            let loginVisible: boolean = true;
            service.isLoginVisible$.subscribe((isVisible: boolean) => {
                loginVisible = isVisible;
            });
            service.hideLogin();
            expect(loginVisible).toBe(false);
        });
    });

    describe('.isUserInRole', () => {
        test('should validate if user is authenticated', () => {
            const authService:OAuthServiceStub = TestBed.get(OAuthService);
            authService._hasValidAccessToken = false;
            expect(service.isUserInRole('role')).toBe(false);
        });

        test('should validate if user session is valid', () => {
            const authService:OAuthServiceStub = TestBed.get(OAuthService);
            authService._hasValidAccessToken = true;
            authService._idToken = null;
            expect(service.isUserInRole('role')).toBe(false);
        });

        test('should validate if user is in role', () => {
            const authService:OAuthServiceStub = TestBed.get(OAuthService);
            authService._hasValidAccessToken = true;
            expect(service.isUserInRole('role')).toBe(true);
            expect(service.isUserInRole('abc')).toBe(false);
        });
    });
});
