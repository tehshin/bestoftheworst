import { Component, OnInit, Input } from '@angular/core';
import { Movie } from '../models/movie';

@Component({
    selector: 'app-movie-item',
    templateUrl: './movie-item.component.html',
    styleUrls: ['./movie-item.component.scss']
})
export class MovieItemComponent {

    @Input() movie: Movie;

    /**
     * Returns an movies image for the requested width.
     * @param movie Movie object
     * @param width Width of the image
     */
    getImageUrlForWidth(movie: Movie, width: number): string {
        if (!movie.image) return '';

        return movie.image.imageUrls[width] || movie.image.imageUrls[500];
    }
}
