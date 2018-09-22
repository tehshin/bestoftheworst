import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EpisodeService } from '../episode.service';
import { Episode } from '../models/episode';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

  @Input("episode")
  _episodeId: number;

  faPlus = faPlus;
  episodes: Episode[] = [];
  showDialog: boolean = false;

  episodeForm: Episode = new Episode();

  get episodeId() {
    return this._episodeId;
  }

  set episodeId(val) {
    this._episodeId = val;
    this.propagateChange(this._episodeId);
  }

  propagateChange = (_: any) => {};

  constructor(private episodeService: EpisodeService) { }

  ngOnInit() {
    this.listEpisodes();
  }

  listEpisodes() {
    this.episodeService.listEpisodes()
      .subscribe(
        (data) => this.episodes = data,
        error => console.log('listEpisodes', error)
      );
  }

  addEpisode() {
    this.episodeService.createEpisode(this.episodeForm)
      .subscribe(
        (newEpisode) => { 
          this.episodes.push(newEpisode);
          this.closeDialog();
        },
        error => console.log(error)
      );
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  writeValue(obj: any): void {
    if (!obj) obj = 0;
    this.episodeId = obj;
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}

  setDisabledState?(isDisabled: boolean) {}

}
