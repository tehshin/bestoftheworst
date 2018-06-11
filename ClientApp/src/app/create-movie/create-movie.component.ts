import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss']
})
export class CreateMovieComponent implements OnInit {

  movie: Movie = new Movie();

  constructor(
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  save() {
    this.movieService.createMovie(this.movie).subscribe(
      (data: Movie) => this.goToMovieDetails(data),
      error => console.log(error)
    );
  }

  goToMovieDetails(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
