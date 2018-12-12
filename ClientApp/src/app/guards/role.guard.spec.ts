import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountService } from '../services/account.service';
import { RoleGuard } from './role.guard';

class ActivatedRouteSnapshotStub {
  private _data: any;
  get data() {
    return this._data;
  }
}

class AccountServiceStub {
  _isAuthenticated: boolean = true;

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  user: any = {
    role: 'a role'
  };

  showLogin(): void {
  }

  isUserInRole(role: string): boolean {
    return true;
  }
}

describe('RoleGuard', () => {
  let roleGuard: RoleGuard;
  
  let accountService: AccountServiceStub;
  let router: any = {
    navigate: jasmine.createSpy('navigate')
  };
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        RoleGuard,
        {
          provide: AccountService,
          useClass: AccountServiceStub,
        },
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRouteSnapshot,
          useClass: ActivatedRouteSnapshotStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    accountService = TestBed.get(AccountService);
    roleGuard = TestBed.get(RoleGuard);
  });

  it('should be created', () => {
    expect(roleGuard).toBeTruthy();
  });

  it('should redirect to index and show login if user is not authenticated', () => {
    const route: ActivatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);

    spyOnProperty(route, 'data', 'get').and.returnValue({ expectedRole: 'a role' });
    spyOn(accountService, 'showLogin').and.callThrough();

    accountService._isAuthenticated = false;

    expect(roleGuard.canActivate(route)).toBe(false);
    expect(accountService.showLogin).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect to index and show login if user session is not valid', () => {
    const route: ActivatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);

    spyOnProperty(route, 'data', 'get').and.returnValue({ expectedRole: 'a role' });
    spyOn(accountService, 'showLogin').and.callThrough();

    accountService.user = null;

    expect(roleGuard.canActivate(route)).toBe(false);
    expect(accountService.showLogin).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect to index and show login if user is not in expected role', () => {
    const route: ActivatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);

    spyOnProperty(route, 'data', 'get').and.returnValue({ expectedRole: 'a role' });
    spyOn(accountService, 'showLogin').and.callThrough();
    spyOn(accountService, 'isUserInRole').and.returnValue(false);

    accountService.user.role = 'not allowed';

    expect(roleGuard.canActivate(route)).toBe(false);
    expect(accountService.showLogin).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should activate route if user is authenticated and has the correct role', () => {
    const route: ActivatedRouteSnapshot = TestBed.get(ActivatedRouteSnapshot);

    spyOnProperty(route, 'data', 'get').and.returnValue({ expectedRole: 'a role' });
    expect(roleGuard.canActivate(route)).toBe(true);
  });
});
