import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpisodeGroupComponent } from '../episode-group/episode-group.component';
import { EpisodeGroup } from '../models/episode-group';
import { LatestMoviesComponent } from './latest-movies.component';
import { Episode } from '../models/episode';
import { Movie } from '../models/movie';


describe('LatestEpisodesComponent', () => {
    let component: LatestMoviesComponent;
    let fixture: ComponentFixture<LatestMoviesComponent>;
    let http: HttpTestingController;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            declarations: [
                EpisodeGroupComponent,
                LatestMoviesComponent
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        http = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(LatestMoviesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(() => {
        http.verify();
    });

    test('component should initialize', () => {
        expect(component).toBeTruthy();
    });

    test('request a list of latest movies grouped by episode', () => {
        http.expectOne('/api/movie/latest').flush([
            new EpisodeGroup(),
            new EpisodeGroup()
        ]);

        expect(component.episodeGroups$).not.toBeFalsy();
    });

    test('display 4 episode groups with 3 movies each', () => {
        http.expectOne('/api/movie/latest').flush([
            new EpisodeGroup({
                episode: new Episode({ title: 'Group 1' }),
                movies: [
                    new Movie(),
                    new Movie(),
                    new Movie(),
                ]
            }),
            new EpisodeGroup({
                episode: new Episode({ title: 'Group 2' }),
                movies: [
                    new Movie(),
                    new Movie(),
                    new Movie(),
                ]
            }),
            new EpisodeGroup({
                episode: new Episode({ title: 'Group 3' }),
                movies: [
                    new Movie(),
                    new Movie(),
                    new Movie(),
                ]
            }),
            new EpisodeGroup({
                episode: new Episode({ title: 'Group 4' }),
                movies: [
                    new Movie(),
                    new Movie(),
                    new Movie(),
                ]
            })
        ]);

        fixture.detectChanges();

        const episodeGroups: DebugElement[] = fixture.debugElement.queryAll(By.directive(EpisodeGroupComponent));
        expect(episodeGroups.length).toBe(4);

        episodeGroups.forEach((episodeGroup: DebugElement) => {
            const movieItems: DebugElement[] = episodeGroup.queryAll(By.css('app-movie-item'));
            expect(movieItems.length).toBe(3);
        });
    });

    test('first episode group is full width', () => {
        http.expectOne('/api/movie/latest').flush([
            new EpisodeGroup()
        ]);

        fixture.detectChanges();

        const episodeGroups: DebugElement[] = fixture.debugElement.queryAll(By.directive(EpisodeGroupComponent));
        expect(episodeGroups[0].parent.classes['is-full']).toBe(true);
    });

    test('the width of every episode group is half except the first', () => {
        http.expectOne('/api/movie/latest').flush([
            new EpisodeGroup(),
            new EpisodeGroup(),
            new EpisodeGroup()
        ]);

        fixture.detectChanges();

        const episodeGroups: DebugElement[] = fixture.debugElement.queryAll(By.directive(EpisodeGroupComponent));
        expect(episodeGroups[1].parent.classes['is-half']).toBe(true);
        expect(episodeGroups[2].parent.classes['is-half']).toBe(true);
    });
});
