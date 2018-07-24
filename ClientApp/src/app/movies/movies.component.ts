import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { MovieList, Movie } from '../movie';
import { faSearch, faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject, combineLatest, forkJoin, merge, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { trigger, transition, style, animate, query, animateChild } from '@angular/animations';
import { EpisodeService } from '../episode.service';
import { Episode } from '../episode';

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
export class MoviesComponent implements OnInit {

  movieList: MovieList;
  pages: number[];
  pageSize: number = 24;
  isSearching: boolean = false;
  isSearchFocused: boolean = false;
  episodes: Episode[] = [];
  episodeFilter: Episode[] = [];
  selectedEpisode: Episode = null;

  private searchText$ = new BehaviorSubject<string>(null);
  private episodeFilter$ = new BehaviorSubject<Episode[]>(this.episodeFilter);

  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faTimes = faTimes;

  constructor(
    private movieService: MovieService,
    private episodeService: EpisodeService
  ) { 
    this.episodeService.listEpisodes().subscribe(
      (episodes) => this.episodes = episodes
    );
  }

  ngOnInit() {
    combineLatest(
      this.searchText$.pipe(
        debounceTime(500),
        distinctUntilChanged()),
      this.episodeFilter$  
    ).pipe(
      tap(([q, episodes]) => {
        this.isSearching = true;
        this.listMovies(1, q);
      })
    ).subscribe();

    this.listMovies(1);
  }

  onSearchFocus() {
    this.isSearchFocused = true;
  }

  onSearchBlur() {
    this.isSearchFocused = false;
  }

  searchMovies(query: string) {
    this.searchText$.next(query);
  }

  addEpisodeToFilter(episode: Episode) {
    if (this.selectedEpisode) {
      const alreadyInList = this.episodeFilter.filter(e => e.id === this.selectedEpisode.id).length > 0;
      if (!alreadyInList) {
        this.episodeFilter.push(this.selectedEpisode);
        this.episodeFilter$.next(this.episodeFilter);
      }
    }
  }

  removeEpisodeFilter(index: number) {
    this.episodeFilter.splice(index, 1);
    this.episodeFilter$.next(this.episodeFilter);
  }

  listMovies(page: number, query?: string) {
    this.movieService.listMovies(page, this.pageSize, query)
      .subscribe(
        (data: MovieList) =>  { 
          this.movieList = data;
          this.isSearching = false;
        },
        error => console.log('listMovies', error)
      );
  }

  getImageUrlForWidth(movie: Movie, width: number) {
    if (!movie.image) return '';
    
    return movie.image.imageUrls[width] || movie.image.imageUrls[500];
  }
}
