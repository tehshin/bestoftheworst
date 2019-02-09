import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { EpisodeGroup } from '../models/episode-group';

/**
 * This component displays a list of movies contained within an `EpisodeGroup`.
 *
 * The list will display only 3 items next to each other, with the possibility to
 * scroll the list content if it overflows.
 *
 * This behavior can be changed by setting the `showAllMovies` input to true.
 *
 * @see EpisodeGroup
 *
 * @example
 * <app-episode-group [episodeGroup]="group" [showAllMovies]="true"></app-episode-group>
 */
@Component({
    selector: 'app-episode-group',
    templateUrl: './episode-group.component.html',
    styleUrls: ['./episode-group.component.scss']
})
export class EpisodeGroupComponent implements OnInit {

    private SINGLE_ITEM_WIDTH: number = 33.3333;
    private maxScrollDistance: number = 0;

    @Input() episodeGroup: EpisodeGroup;
    @Input() showAllMovies: boolean;

    @ViewChild('movieList') movieList: ElementRef<HTMLElement>;

    /**
     * Returns whether the movie list is scrollable
     */
    get isScrollable(): boolean {
        if (!this.episodeGroup || !this.episodeGroup.movies) return false;
        return this.episodeGroup && !this.showAllMovies && this.episodeGroup.movies.length > 3;
    }

    /**
     * Returns whether it is possible to scroll to the left
     */
    get hasPrevious(): boolean {
        return this.isScrollable && this.scrollPos < 0;
    }

    /**
     * Returns whether it is possible to scroll to the right
     */
    get hasNext(): boolean {
        return this.isScrollable && this.scrollPos > this.maxScrollDistance;
    }

    faAngleRight: object = faAngleRight;
    faAngleLeft: object = faAngleLeft;

    scrollPos: number = 0;

    ngOnInit(): void {
        if (this.episodeGroup && this.episodeGroup.movies) {
            this.maxScrollDistance = Math.min((this.episodeGroup.movies.length - 3) * -this.SINGLE_ITEM_WIDTH, 0);
        }
    }

    /**
     * Moves the movie list one item width to the left
     */
    scrollRight(): void {
        this.scrollPos -= this.SINGLE_ITEM_WIDTH;
    }

    /**
     * Moves the movie list on item width to the right
     */
    scrollLeft(): void {
        this.scrollPos += this.SINGLE_ITEM_WIDTH;
    }
}
