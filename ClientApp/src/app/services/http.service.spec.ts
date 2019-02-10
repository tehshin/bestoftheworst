import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

describe('HttpService', () => {
    let service: HttpService;
    let http: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                HttpService
            ]
        });
    }));

    beforeEach(() => {
        const httpClient: HttpClient = TestBed.get(HttpClient);
        http = TestBed.get(HttpTestingController);
        service = new HttpService(httpClient, '/api/test');
    });

    test('service initializes', () => {
        expect(service).toBeTruthy();
    });

    test('returns a GET request observable', () => {
        const getRequest: Observable<string> = 
            (service as any).get('');

        expect(getRequest).not.toBeFalsy();
        expect(getRequest.subscribe).not.toBeFalsy();

        getRequest.subscribe();

        const httpRequest: TestRequest = http.expectOne('/api/test');
        expect(httpRequest).toBeTruthy();
        expect(httpRequest.request.method).toBe('GET');
    });

    test('returns a POST request observable', () => {
        const postRequest: Observable<string> =
            (service as any).post('');

        expect(postRequest).not.toBeFalsy();
        expect(postRequest.subscribe).not.toBeFalsy();

        postRequest.subscribe();

        const httpRequest: TestRequest = http.expectOne('/api/test');
        expect(httpRequest).toBeTruthy();
        expect(httpRequest.request.method).toBe('POST');
    });

    test('returns a PUT request observable', () => {
        const putRequest: Observable<string> =
            (service as any).put('');

        expect(putRequest).not.toBeFalsy();
        expect(putRequest.subscribe).not.toBeFalsy();

        putRequest.subscribe();

        const httpRequest: TestRequest = http.expectOne('/api/test');
        expect(httpRequest).toBeTruthy();
        expect(httpRequest.request.method).toBe('PUT');
    });

    test('creates a DELETE request and executes it immediately', () => {
        (service as any).delete('');

        const deleteRequest: TestRequest = http.expectOne('/api/test');
        expect(deleteRequest).toBeTruthy();
        expect(deleteRequest.request.method).toBe('DELETE');
    });
});
