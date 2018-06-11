import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss']
})
export class CreateMovieComponent implements OnInit {

  movie: Movie = new Movie();

  constructor(private movieService: MovieService) { }

  ngOnInit() {
  }

  save() {
    this.movieService.createMovie(this.movie).subscribe(
      (data: any) => console.log(data),
      error => console.log(error)
    );
  }

}
