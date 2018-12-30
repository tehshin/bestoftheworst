import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { TagService } from '../services/tag.service';


@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagInputComponent),
    multi: true
  }]
})
export class TagInputComponent implements OnInit, ControlValueAccessor {

  @Input("tags")
  _tags: string[] = [];

  newTag: string;
  showDropdown: boolean = false;
  selectedIndex: number = 0;
  tagSuggestions: string[] = [];
  
  private searchText$ = new Subject<string>();

  get tags() {
    return this._tags;
  }

  set tags(val) {
    if (val) {
      this._tags = val;
    }
    
    this.propagateChange(this._tags);
  }

  propagateChange = (_: any) => {};

  constructor(
    private tagService: TagService
  ) { }

  ngOnInit() {
    this.tagService.autocompleteSuggestions$.subscribe(_ => this.tagSuggestions = _);

    this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(q => {
        this.showDropdown = q.length > 0;
      }),
      tap(q => this.tagService.autocomplete(q))
    ).subscribe();
  }

  keyEnter(tag: string, $event: KeyboardEvent) {
    if (this.showDropdown) {
      tag = this.tagSuggestions[this.selectedIndex] || tag;
    }

    if (tag) {
      this.addTag(tag);
    }

    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();

    $event.cancelBubble = true;
    $event.returnValue = false;
  }

  addTag(tag: string) {
    this.tags.push(tag);
    this.newTag = "";
    this.showDropdown = false;
    this.searchText$.next("");
  }

  removeTag(index: number, $event) {
    this.tags.splice(index, 1);

    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();

    $event.cancelBubble = true;
    $event.returnValue = false;
  }

  keyDown($event: KeyboardEvent) {
    if ($event.keyCode === 40 && this.selectedIndex < this.tagSuggestions.length - 1) {
      this.selectedIndex++;
    } else if ($event.keyCode === 38 && this.selectedIndex > 0) {
      this.selectedIndex--;
    }

    if ($event.keyCode === 27) {
      this.showDropdown = false;
    }

    if ($event.keyCode === 40 
      || $event.keyCode === 38
      || $event.keyCode === 27) {
      if ($event.stopPropagation) $event.stopPropagation();
      if ($event.preventDefault) $event.preventDefault();

      $event.cancelBubble = true;
      $event.returnValue = false;
    }
  }

  autocomplete(q: string) {
    this.searchText$.next(q);
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  writeValue(obj: any): void {
    this.tags = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

}
