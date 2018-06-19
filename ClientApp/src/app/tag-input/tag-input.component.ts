import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  addTag(tag: string) {
    this.tags.push(tag);
    this.newTag = "";
  }

  removeTag(index: number, $event) {
    this.tags.splice(index, 1);

    if ($event.stopPropagation) $event.stopPropagation();
    if ($event.preventDefault) $event.preventDefault();

    $event.cancelBubble = true;
    $event.returnValue = false;
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
