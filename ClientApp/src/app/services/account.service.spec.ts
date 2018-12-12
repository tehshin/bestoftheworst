import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { AccountService } from './account.service';


class OAuthServiceStub {
  _hasValidAccessToken: boolean = true;
  _accessToken: string = 'token';

  hasValidAccessToken(): boolean {
    return this._hasValidAccessToken;
  }

  getAccessToken(): string {
    return this._accessToken;
  }
}

describe('AccountService', () => {
  let service: AccountService;
  
  beforeEach(async() => {
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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('.showLogin', () => {
    it('should set login to visible', () => {
      let loginVisible: boolean = false;
      service.isLoginVisible$.subscribe((isVisible: boolean) => {
        loginVisible = isVisible;
      });
      service.showLogin();
      expect(loginVisible).toBe(true);
    });
  });

  describe('.hideLogin', () => {
    it('should set login to not visible', () => {
      let loginVisible: boolean = true;
      service.isLoginVisible$.subscribe((isVisible: boolean) => {
        loginVisible = isVisible;
      });
      service.hideLogin();
      expect(loginVisible).toBe(false);
    });
  });

  describe('.isUserInRole', () => {
    it('should validate if user is authenticated');
    it('should validate if user session is valid');
    it('should validate if user is in role');
  });
});
