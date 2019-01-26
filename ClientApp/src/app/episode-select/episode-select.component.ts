import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Episode } from '../models/episode';
import { EpisodeService } from '../services/episode.service';

@Component({
    selector: 'app-episode-select',
    templateUrl: './episode-select.component.html',
    styleUrls: ['./episode-select.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EpisodeSelectComponent),
        multi: true
    }]
})
export class EpisodeSelectComponent implements OnInit, ControlValueAccessor {

    @Input('episode') _episodeId: number;

    faPlus: object = faPlus;
    episodes: Episode[] = [];
    showDialog: boolean = false;

    episodeForm: Episode = new Episode();

    get episodeId(): number {
        return this._episodeId;
    }

    set episodeId(val: number) {
        this._episodeId = val;
        this.propagateChange(this._episodeId);
    }

    propagateChange = (_: any): void => { };

    constructor(private episodeService: EpisodeService) { }

    ngOnInit(): void {
        this.listEpisodes();
    }

    listEpisodes(): void {
        this.episodeService.listEpisodes()
            .subscribe(
                (data: Episode[]) => this.episodes = data
            );
    }

    addEpisode(): void {
        this.episodeService.createEpisode(this.episodeForm)
            .subscribe(
                (newEpisode: Episode) => {
                    this.episodes.push(newEpisode);
                    this.closeDialog();
                }
            );
    }

    openDialog(): void {
        this.showDialog = true;
    }

    closeDialog(): void {
        this.showDialog = false;
    }

    writeValue(obj: any): void {
        if (!obj) obj = 0;
        this.episodeId = obj;
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }

    setDisabledState?(isDisabled: boolean): void { }

}
