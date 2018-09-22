import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { faImdb, faWikipediaW, faAmazon } from '@fortawesome/free-brands-svg-icons';
import { faLink, faHeart, faStar, faTrophy, faTired, faMeh, faEdit } from '@fortawesome/free-solid-svg-icons';
import { switchMap, catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { Link } from '../link';
import { LinkType } from '../link-type.enum';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {

  movieId: number;
  movie$: Observable<Movie>;

  faImdb = faImdb;
  faWikipedia = faWikipediaW;
  faLink = faLink;
  faAmazon = faAmazon;
  faHeart = faHeart;
  faStar = faStar;
  faTrophy = faTrophy;
  faTired = faTired;
  faMeh = faMeh;
  faEdit = faEdit;

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

  ngOnInit() {
    this.movie$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.movieId = +params.get('id');
        return this.movieService.getById(this.movieId)
          .pipe(
            catchError((error) => {
              if (error.notfound) {
                this.router.navigate(['/404'], { 
                  queryParams: { u: window.location.pathname+window.location.search } 
                });
              }
              return empty();
            })
          );
      })
    );
  }

  getVideoUrl(videoId: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  getMovieLinkIcon(link: Link) {
    switch (link.linkType) {
      case LinkType.IMDB:
        return this.faImdb;
      case LinkType.Wikipedia:
        return this.faWikipedia;
      default:
        return this.faLink;
    }
  }

  getImageUrlForWidth(movie: Movie, width: number) {
    return movie.image.imageUrls[width] || movie.image.imageUrls[500];
  }
}
