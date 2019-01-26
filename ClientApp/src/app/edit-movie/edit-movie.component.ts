import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-edit-movie',
    templateUrl: './edit-movie.component.html',
    styleUrls: ['./edit-movie.component.scss']
})
export class EditMovieComponent implements OnInit {

    movieId: number;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.movieId = +params.get('id');
        });
    }

}
