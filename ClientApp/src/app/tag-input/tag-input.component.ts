import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { TagService } from '../tag.service';


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

  tagSuggestions$: Observable<string[]>;
  private searchText$ = new Subject<string>()

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
    this.tagSuggestions$ = this.searchText$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(q => 
        this.tagService.autocomplete(q))
    );
  }

  addTag(tag: string) {
    this.tags.push(tag);
    this.newTag = "";
    this.searchText$.next("");
  }

  removeTag(index: number, $event) {
    this.tags.splice(index, 1);

    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();

    $event.cancelBubble = true;
    $event.returnValue = false;
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
