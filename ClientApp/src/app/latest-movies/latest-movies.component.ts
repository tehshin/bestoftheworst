import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EpisodeGroup } from '../models/episode-group';
import { MovieService } from '../services/movie.service';

@Component({
    selector: 'app-latest-movies',
    templateUrl: './latest-movies.component.html',
    styleUrls: ['./latest-movies.component.scss']
})
export class LatestMoviesComponent implements OnInit {

    episodeGroups$: Observable<EpisodeGroup[]>;

    constructor(
        private movieService: MovieService
    ) { }

    ngOnInit(): void {
        this.episodeGroups$ = this.movieService.listLatestMoviesGroupedByEpisode();
    }

}
