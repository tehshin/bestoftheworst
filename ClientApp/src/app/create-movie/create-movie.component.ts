import { Component, OnInit } from '@angular/core';
import { Movie, MovieForm } from '../movie';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss']
})
export class CreateMovieComponent implements OnInit {

  movie: MovieForm = new MovieForm();
  
  faPlus = faPlus;
  faTimes = faTimes;

  constructor(
    private movieService: MovieService,
    private imageService: ImageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  trackByIndex(index, obj) {
    return index;
  }

  addTag() {
    this.movie.tags.push("");
  }

  removeTag(index) {
    this.movie.tags.splice(index, 1);
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
