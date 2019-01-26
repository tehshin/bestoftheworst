import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie';
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { EpisodeService } from '../services/episode.service';
import { Episode } from '../models/episode';
import { MovieList } from '../models/movie-list';

@Component({
    selector: 'app-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.scss'],
    animations: [
        trigger('searchHint', [
            transition(':enter', [
                style({ height: 0 }),
                animate('150ms ease', style({ height: '*' })),
                query('@showHintText', animateChild()),
            ]),
            transition(':leave', [
                query('@showHintText', animateChild()),
                style({ height: '*' }),
                animate('150ms ease', style({ height: 0 }))
            ])
        ]),
        trigger('showHintText', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('50ms ease', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('50ms ease', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class MoviesComponent implements OnInit, OnDestroy {

    movieList: MovieList;
    pages: number[];
    pageSize: number = 24;
    isSearching: boolean = false;
    isSearchFocused: boolean = false;
    episodes: Episode[] = [];
    episodeFilter: Episode[] = [];
    selectedEpisode: Episode = null;

    private searchText$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private episodeFilter$: BehaviorSubject<Episode[]> = new BehaviorSubject<Episode[]>(this.episodeFilter);
    private destroyed$: Subject<void> = new Subject<void>();

    faSearch: object = faSearch;
    faChevronDown: object = faChevronDown;
    faTimes: object = faTimes;

    constructor(
        private movieService: MovieService,
        private episodeService: EpisodeService
    ) {
        this.episodeService.listEpisodes()
            .subscribe((episodes: Episode[]) => this.episodes = episodes);
    }

    ngOnInit(): void {
        combineLatest(
            this.searchText$.pipe(
                debounceTime(500),
                distinctUntilChanged()),
            this.episodeFilter$
        ).pipe(
            takeUntil(this.destroyed$)
        ).subscribe((data: [string, Episode[]]) => {
            const q: string = data[0];
            this.isSearching = true;
            this.listMovies(1, q);
        });

        this.listMovies(1);
    }

    onSearchFocus(): void {
        this.isSearchFocused = true;
    }

    onSearchBlur(): void {
        this.isSearchFocused = false;
    }

    searchMovies(queryString: string): void {
        this.searchText$.next(queryString);
    }

    addEpisodeToFilter(episode: Episode): void {
        if (this.selectedEpisode) {
            const alreadyInList: boolean = !!this.episodeFilter.find((e: Episode) => e.id === this.selectedEpisode.id);
            if (!alreadyInList) {
                this.episodeFilter.push(this.selectedEpisode);
                this.episodeFilter$.next(this.episodeFilter);
            }
        }
    }

    removeEpisodeFilter(index: number): void {
        this.episodeFilter.splice(index, 1);
        this.episodeFilter$.next(this.episodeFilter);
    }

    listMovies(page: number, queryString?: string): void {
        this.movieService.listMovies(page, this.pageSize, queryString)
            .subscribe((data: MovieList) => {
                this.movieList = data;
                this.isSearching = false;
            });
    }

    getImageUrlForWidth(movie: Movie, width: number): string {
        if (!movie.image) return '';

        return movie.image.imageUrls[width] || movie.image.imageUrls[500];
    }
}
