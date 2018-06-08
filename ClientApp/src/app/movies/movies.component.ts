import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movies: Movie[];

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.listMovies();
  }

  listMovies() {
    this.movieService.listMovies()
      .subscribe(
        (data: Movie[]) => this.movies = data,
        error => console.log('listMovies', error)
      );
  };
}
