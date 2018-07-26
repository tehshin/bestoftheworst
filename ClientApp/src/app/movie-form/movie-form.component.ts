import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { Movie, MovieForm } from '../movie';
import { MovieService } from '../movie.service';
import { Router } from '@angular/router';
import { faPlus, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { LinkType } from '../link-type.enum';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Link } from '../link';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MovieDbService } from '../movie-db.service';
import { MovieDbMovie } from 'src/app/movie-db-search-result';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {

  @Input("form-title") title: string;

  titleQuery$ = new Subject<string>();

  movieSuggestions: MovieDbMovie[] = [];

  private _movieId: number;
  @Input("movie")
  set movieId(movieId: number) {
    this._movieId = movieId;
    this.getMovie();
  }

  get movieId() {
    return this._movieId;
  }

  imagePreview: string;

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
    private movieDbService: MovieDbService,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.linkTypeKeys = Object.keys(this.linkTypes).filter(f => !isNaN(Number(f)));
    this.createForm();
    this.initApiSearch();
  }

  ngOnInit() {
  }

  getControl(name: string) {
    return this.form.get(name);
  }

  initApiSearch() {
    this.titleQuery$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((q) => {
        this.searchMovieDb(q);
      })
    ).subscribe();
  }

  getMovie() {
    this.movieService.getById(this.movieId).subscribe(
      (movie) => this.setFormValues(movie)
    );
  }

  setFormValues(movie: Movie) {
    if (movie.image) {
      this.imagePreview = movie.image.imageUrls[500];
    }

    this.form.get('title').patchValue(movie.title);
    this.form.get('synopsis').patchValue(movie.synopsis);
    this.form.get('episode').patchValue(movie.episode.id);
    this.form.get('image').patchValue(movie.image.id);
    this.form.get('tags').patchValue(movie.tags.map(t => t.name));

    let formLinks = this.form.get('links') as FormArray;
    if (movie.links) {
      movie.links.forEach(l => this.addLink(l));
    }
  }

  createForm() {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'overview': ['', Validators.required],
      'synopsis': ['', Validators.compose([Validators.required, Validators.minLength(50)])],
      'release_date': [null],
      'runtime': [null],
      'episode': [null, Validators.required],
      'image': [null, Validators.required],
      'tags': [[]],
      'links': this.fb.array([]),
      'genres': this.fb.array([])
    });
  }

  addLink(link: Link) {
    let formLink = this.fb.group({
      'id': link ? link.id : 0,
      'linkType': link ? link.linkType : 0,
      'name': link ? link.name : '',
      'href': link ? link.href : 'http://'
    });

    formLink.get('linkType').valueChanges.subscribe(linkType => {
      switch (+linkType) {
        case LinkType.IMDB:
          formLink.get('name').patchValue('IMDB');
          break;
        case LinkType.Wikipedia:
          formLink.get('name').patchValue('Wikipedia');
          break;
        default:
          break;
      }
    });

    this.links.push(formLink);
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

    if (this.movieId) {
      this.movieService.updateMovie(this.movieId, movie).subscribe(
        _ => this.goToMovieDetails(this.movieId),
        error => console.log(error)
      );
    } else {
      this.movieService.createMovie(movie).subscribe(
        (data: Movie) => this.goToMovieDetails(data.id),
        error => console.log(error)
      );
    }
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  nameOnKeyUp(name: string) {
    this.titleQuery$.next(name);
  }

  searchMovieDb(title: string) {
    this.movieDbService.searchMovie(title).subscribe(
      (result) => this.movieSuggestions = result.results
    );
  }

  copyMovieInfo(movieId: number) {
    this.movieDbService.getMovieById(movieId).subscribe(
      (info) => {
        this.form.get('title').patchValue(info.title);
        this.form.get('overview').patchValue(info.overview);
        this.form.get('release_date').patchValue(info.release_date);
        this.form.get('runtime').patchValue(info.runtime);

        // TODO: download image

        this.movieSuggestions = [];
      }
    );
  }
}