import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { faImdb, faWikipediaW } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Link } from '../link';
import { LinkType } from '../link-type.enum';

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

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.movie$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.movieId = +params.get('id');
        return this.movieService.getById(this.movieId);
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
        break;
      case LinkType.Wikipedia:
        return this.faWikipedia;
        break;
      default:
        return this.faLink;
        break;
    }
  }
}
