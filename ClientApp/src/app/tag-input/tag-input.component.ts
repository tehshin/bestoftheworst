import { Component, forwardRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, takeUntil } from 'rxjs/operators';
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
export class TagInputComponent implements OnInit, ControlValueAccessor, OnDestroy {

    @Input() _tags: string[] = [];

    newTag: string;
    showDropdown: boolean = false;
    selectedIndex: number = 0;
    tagSuggestions: string[] = [];

    private searchText$: Subject<string> = new Subject<string>();
    private destroyed$: Subject<void> = new Subject<void>();

    get tags(): string[] {
        return this._tags;
    }

    set tags(val: string[]) {
        if (val) {
            this._tags = val;
        }

        this.propagateChange(this._tags);
    }

    propagateChange: Function = (_: any) => { };

    constructor(
        private tagService: TagService
    ) { }

    ngOnInit(): void {
        this.tagService.autocompleteSuggestions$
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe((suggestions: string[]) => this.tagSuggestions = suggestions);

        this.searchText$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((q: string) => {
            this.showDropdown = q.length > 0;
            this.tagService.autocomplete(q);
        });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    keyEnter(tag: string, $event: KeyboardEvent): void {
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

    addTag(tag: string): void {
        this.tags.push(tag);
        this.newTag = '';
        this.showDropdown = false;
        this.searchText$.next('');
    }

    removeTag(index: number, $event: Event): void {
        this.tags.splice(index, 1);

        if ($event.stopPropagation) $event.stopPropagation();
        if ($event.preventDefault) $event.preventDefault();

        $event.cancelBubble = true;
        $event.returnValue = false;
    }

    keyDown($event: KeyboardEvent): void {
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

    autocomplete(q: string): void {
        this.searchText$.next(q);
    }

    focusInput(input: HTMLInputElement): void {
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
