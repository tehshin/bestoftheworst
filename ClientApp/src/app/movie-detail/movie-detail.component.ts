import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { ActivatedRoute } from '@angular/router';

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
}
