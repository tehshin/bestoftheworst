import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { MovieList } from '../movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movieList: MovieList;
  pages: number[];
  pageSize: number = 24;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.listMovies(1);
  }

  listMovies(page: number) {
    this.movieService.listMovies(page, this.pageSize)
      .subscribe(
        (data: MovieList) => this.movieList = data,
        error => console.log('listMovies', error)
      );
  }
}
