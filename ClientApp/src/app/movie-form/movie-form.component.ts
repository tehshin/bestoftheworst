import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { LinkType } from '../models/link-type.enum';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Link } from '../models/link';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MovieDbService } from '../services/movie-db.service';
import { MovieDbMovie, MovieDbSearchResult, MovieDbDetails } from '../models/movie-db-search-result';
import { MovieImageInputComponent } from '../movie-image-input/movie-image-input.component';
import { Genre } from '../models/genre';
import { MovieForm } from '../models/movie-form';
import { Tag } from '../models/tag';

@Component({
    selector: 'app-movie-form',
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {

    @Input('form-title') title: string;

    @ViewChild(MovieImageInputComponent)
    private imageInputComponent: MovieImageInputComponent;

    titleQuery$: Subject<string> = new Subject<string>();

    movieSuggestions: MovieDbMovie[] = [];

    private _movieId: number;
    @Input('movie')
    set movieId(movieId: number) {
        this._movieId = movieId;
        this.getMovie();
    }

    get movieId(): number {
        return this._movieId;
    }

    imagePreview: string;

    form: FormGroup;

    linkTypes: object = LinkType;
    linkTypeKeys: string[];

    faPlus: object = faPlus;
    faTimes: object = faTimes;
    faCheck: object = faCheck;

    get titleInput(): any {
        return this.form.get('title');
    }

    get synopsisInput(): any {
        return this.form.get('synopsis');
    }

    get episodeInput(): any {
        return this.form.get('episode');
    }

    get links(): FormArray {
        return this.form.get('links') as FormArray;
    }

    get genres(): FormArray {
        return this.form.get('genres') as FormArray;
    }

    constructor(
        private movieService: MovieService,
        private movieDbService: MovieDbService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.linkTypeKeys = Object.keys(this.linkTypes).filter((f: string) => !isNaN(Number(f)));
        this.createForm();
        this.initApiSearch();
    }

    ngOnInit(): any {
    }

    getControl(name: string): any {
        return this.form.get(name);
    }

    initApiSearch(): any {
        this.titleQuery$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap((q: string) => {
                this.searchMovieDb(q);
            })
        ).subscribe();
    }

    getMovie(): any {
        this.movieService.getById(this.movieId).subscribe(
            (movie: Movie) => this.setFormValues(movie)
        );
    }

    setFormValues(movie: Movie): any {
        if (movie.image) {
            this.imagePreview = movie.image.imageUrls[500];
        }

        this.form.get('title').patchValue(movie.title);
        this.form.get('overview').patchValue(movie.overview);
        this.form.get('runtime').patchValue(movie.runtime);
        this.form.get('releaseDate').patchValue(movie.releaseDate);
        this.form.get('placement').patchValue(movie.placement);
        this.form.get('synopsis').patchValue(movie.synopsis);
        this.form.get('episode').patchValue(movie.episode.id);
        this.form.get('image').patchValue(movie.image.id);
        this.form.get('tags').patchValue(movie.tags.map((t: Tag) => t.name));

        if (movie.links) {
            movie.links.forEach((l: Link) => this.addLink(l));
        }

        if (movie.genres) {
            movie.genres.forEach((g: Genre) => this.addGenre(g));
        }
    }

    createForm(): any {
        this.form = this.fb.group({
            'title': ['', Validators.required],
            'overview': ['', Validators.required],
            'synopsis': ['', Validators.compose([Validators.required, Validators.minLength(50)])],
            'releaseDate': [null],
            'runtime': [null],
            'placement': [0],
            'episode': [null, Validators.required],
            'image': [null, Validators.required],
            'tags': [[]],
            'links': this.fb.array([]),
            'genres': this.fb.array([])
        });
    }

    addGenre(genre: Genre): any {
        this.genres.push(this.fb.control(genre ? genre.name : ''));
    }

    removeGenre(index: number): any {
        this.genres.removeAt(index);
    }

    addLink(link: Link): any {
        const formLink: FormGroup = this.fb.group({
            'id': link ? link.id : 0,
            'linkType': link ? link.linkType : 0,
            'name': link ? link.name : '',
            'href': link ? link.href : 'http://'
        });

        formLink.get('linkType').valueChanges.subscribe((linkType: LinkType) => {
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

    removeLink(index: number): any {
        this.links.removeAt(index);
    }

    save(movieForm: any): any {
        const linksDeepCopy: Link[] = movieForm.links.map(
            (link: Link) => new Link(link)
        );

        const genreDeepCopy: Genre[] = movieForm.genres.map(
            (genre: string) => new Genre({ name: genre })
        );

        const movie: MovieForm = new MovieForm({
            title: movieForm.title,
            overview: movieForm.overview,
            releaseDate: movieForm.releaseDate,
            runtime: movieForm.runtime,
            placement: movieForm.placement,
            synopsis: movieForm.synopsis,
            episodeId: movieForm.episode,
            image: movieForm.image,
            tags: movieForm.tags,
            links: linksDeepCopy,
            genres: genreDeepCopy
        });

        if (this.movieId) {
            this.movieService.updateMovie(this.movieId, movie)
                .subscribe(() => this.goToMovieDetails(this.movieId));
        } else {
            this.movieService.createMovie(movie)
                .subscribe((data: Movie) => this.goToMovieDetails(data.id));
        }
    }

    goToMovieDetails(movieId: number): void {
        this.router.navigate(['/movie', movieId]);
    }

    nameOnKeyUp(name: string): void {
        this.titleQuery$.next(name);
    }

    searchMovieDb(title: string): void {
        this.movieDbService.searchMovie(title)
            .subscribe((result: MovieDbSearchResult) => this.movieSuggestions = result.results);
    }

    copyMovieInfo(movieId: number): void {
        this.movieDbService.getMovieById(movieId).subscribe(
            (info: MovieDbDetails) => {
                this.imageInputComponent.downloadImage(info.poster_path);

                this.form.get('title').patchValue(info.title);
                this.form.get('overview').patchValue(info.overview);
                this.form.get('releaseDate').patchValue(info.release_date);
                this.form.get('runtime').patchValue(info.runtime);

                this.addLink(new Link({
                    id: 0,
                    linkType: 1,
                    name: 'IMDB',
                    href: `https://www.imdb.com/title/${info.imdb_id}`
                }));

                info.genres.forEach((genre: any) => {
                    this.addGenre(new Genre({ name: genre.name }));
                });

                this.movieSuggestions = [];
            }
        );
    }

}
