import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie, MovieList } from '../movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movieList: MovieList;
  page: number = 1;
  pageSize: number = 12;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.listMovies();
  }

  listMovies() {
    this.movieService.listMovies(this.page, this.pageSize)
      .subscribe(
        (data: MovieList) => this.movieList = data,
        error => console.log('listMovies', error)
      );
  };
}
