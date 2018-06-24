import { Component, OnInit } from '@angular/core';
import { Movie, MovieForm } from '../movie';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';
import { faPlus, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { LinkType } from '../link-type.enum';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Link } from '../link';

@Component({
  selector: 'app-create-movie',
  templateUrl: './create-movie.component.html',
  styleUrls: ['./create-movie.component.scss']
})
export class CreateMovieComponent implements OnInit {

  form: FormGroup;

  linkTypes = LinkType;
  linkTypeKeys: string[];

  faPlus = faPlus;
  faTimes = faTimes;
  faCheck = faCheck;
  
  get titleInput() {
    return this.form.get('title');
  }

  get synopsisInput() {
    return this.form.get('synopsis');
  }

  get episodeInput() {
    return this.form.get('episode');
  }

  get links(): FormArray {
    return this.form.get("links") as FormArray;
  }

  constructor(
    private movieService: MovieService,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.linkTypeKeys = Object.keys(this.linkTypes).filter(f => !isNaN(Number(f)));
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'synopsis': ['', Validators.compose([Validators.required, Validators.minLength(50)])],
      'episode': [null, Validators.required],
      'image': [null, Validators.required],
      'tags': [[]],
      'links': this.fb.array([])
    });
  }

  addLink() {
    let link = this.fb.group({
      'linkType': 0,
      'name': '',
      'href': 'http://'
    });

    link.get('linkType').valueChanges.subscribe(linkType => {
      switch (+linkType) {
        case LinkType.IMDB:
          link.get('name').patchValue('IMDB');
          break;
        case LinkType.Wikipedia:
          link.get('name').patchValue('Wikipedia');
          break;
        default:
          break;
      }
    });

    this.links.push(link);
  }

  removeLink(index: number) {
    this.links.removeAt(index);
  }

  save(movieForm) {
    const linksDeepCopy: Link[] = movieForm.links.map(
      (link) => new Link(link)
    );

    let movie = new MovieForm({ 
      title: movieForm.title,
      synopsis: movieForm.synopsis,
      episodeId: movieForm.episode,
      image: movieForm.image,
      tags: movieForm.tags,
      links: linksDeepCopy
    });

    this.movieService.createMovie(movie).subscribe(
      (data: Movie) => this.goToMovieDetails(data),
      error => console.log(error)
    );
  }

  goToMovieDetails(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
