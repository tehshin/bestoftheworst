import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss']
})
export class CreateMovieComponent implements OnInit {

  movie: Movie = new Movie();
  selectedFile: File = null;

  constructor(
    private movieService: MovieService,
    private imageService: ImageService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onImageSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  uploadImage() {
    console.log(this.selectedFile);
    if (this.selectedFile != null)
      this.imageService.createImage(this.selectedFile).subscribe(
        (data) => console.log(data),
        error => console.log(error)
      )
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
