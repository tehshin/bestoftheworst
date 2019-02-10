import { TestBed, inject, async } from '@angular/core/testing';

import { TagService } from './tag.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TagService', () => {
    let service: TagService;
    let http: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                TagService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        http = TestBed.get(HttpTestingController);
        service = TestBed.get(TagService);
    });

    afterAll(() => {
        http.verify();
    });

    test('service can be initialized', () => {
        expect(service).toBeTruthy();
    });

    test('creates http get search request for autocomplete', () => {
        const query: string = 'abc';
        service.autocomplete(query);
        http.expectOne(`/api/tag/autocomplete?term=${query}`);
    });

    test('response data is sent to autocompleteSuggestions observable', () => {
        const query: string = 'test';
        let result: string[] = [];

        service.autocompleteSuggestions$
            .subscribe((tags: string[]) => {
                result = tags;
            });

        service.autocomplete(query);
        http.expectOne(`/api/tag/autocomplete?term=${query}`)
            .flush(['test', 'test2']);

        expect(result.length).toBe(2);
        expect(result[0]).toBe('test');
        expect(result[1]).toBe('test2');
    });
});
