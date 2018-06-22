import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {

  movie: Movie;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getMovie();
  }

  getMovie() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.movieService.getById(id)
      .subscribe(
        (data: Movie) => this.movie = data,
        error => console.log(error)
      );
  }

  getVideoUrl(videoId: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
}
