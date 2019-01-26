import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faAmazon, faImdb, faWikipediaW } from '@fortawesome/free-brands-svg-icons';
import { faEdit, faHeart, faLink, faMeh, faStar, faTired, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Link } from '../models/link';
import { LinkType } from '../models/link-type.enum';
import { Movie } from '../models/movie';
import { AccountService } from '../services/account.service';
import { MovieService } from '../services/movie.service';

@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {

    movieId: number;
    movie$: Observable<Movie>;

    faImdb: object = faImdb;
    faWikipedia: object = faWikipediaW;
    faLink: object = faLink;
    faAmazon: object = faAmazon;
    faHeart: object = faHeart;
    faStar: object = faStar;
    faTrophy: object = faTrophy;
    faTired: object = faTired;
    faMeh: object = faMeh;
    faEdit: object = faEdit;

    get showEditMovie(): boolean {
        return this.accountService.isUserInRole('Administrator');
    }

    constructor(
        private route: ActivatedRoute,
        private movieService: MovieService,
        private sanitizer: DomSanitizer,
        private router: Router,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.movie$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
                this.movieId = +params.get('id');
                return this.movieService.getById(this.movieId)
                    .pipe(
                        catchError((error: any): Observable<Movie> => {
                            if (error.notfound) {
                                this.router.navigate(['/404'], {
                                    queryParams: { u: window.location.pathname + window.location.search }
                                });
                            }
                            return of(null);
                        })
                    );
            })
        );
    }

    getVideoUrl(videoId: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }

    getMovieLinkIcon(link: Link): object {
        switch (link.linkType) {
            case LinkType.IMDB:
                return this.faImdb;
            case LinkType.Wikipedia:
                return this.faWikipedia;
            default:
                return this.faLink;
        }
    }

    getImageUrlForWidth(movie: Movie, width: number): string {
        return movie.image.imageUrls[width] || movie.image.imageUrls[500];
    }

    getRankIcon(movie: Movie): object {
        switch (movie.placement) {
            case 1:
                return faTrophy;
            case 2:
                return faTired;
            default:
                return faMeh;
        }
    }

    getRankTitle(movie: Movie): string {
        switch (movie.placement) {
            case 1:
                return 'Best of the Worst!';
            case 2:
                return 'Destroyed';
            default:
                return 'Meh';
        }
    }

}
