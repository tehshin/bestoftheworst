import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { MovieList, Movie } from '../movie';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {

  movieList: MovieList;
  pages: number[];
  pageSize: number = 24;

  faSearch = faSearch;
  faChevronDown = faChevronDown;

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

  getImageUrlForWidth(movie: Movie, width: number) {
    if (!movie.image) return '';
    
    return movie.image.imageUrls[width] || movie.image.imageUrls[500];
  }
}
