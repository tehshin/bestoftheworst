import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'

import { RoleGuard } from './role-guard.service';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('RoleGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [RoleGuard, OAuthService, HttpClient, UrlHelperService]
    });
  });

  it('should be created', inject([RoleGuard], (service: RoleGuard) => {
    expect(service).toBeTruthy();
  }));
});
