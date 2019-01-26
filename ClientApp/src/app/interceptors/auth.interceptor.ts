import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth header from the service.
        const auth: AccountService = this.injector.get(AccountService);

        // should be based on a baseUrl setting or something
        // maybe store api endpoint url in environment
        const isApiCall: boolean = req.url.startsWith('/api');

        if (auth.isAuthenticated && isApiCall) {
            let headers: HttpHeaders = req.headers;
            headers = req.headers.set('Authorization', 'Bearer ' + auth.accessToken);

            req = req.clone({ headers });
        }

        return next.handle(req);
    }

}
