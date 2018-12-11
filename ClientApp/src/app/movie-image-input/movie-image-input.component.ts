import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-movie-image-input',
  templateUrl: './movie-image-input.component.html',
  styleUrls: ['./movie-image-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MovieImageInputComponent),
    multi: true
  }]
})
export class MovieImageInputComponent implements OnInit, ControlValueAccessor {

  @Input("image")
  _imageId: string;

  @Input("preview-url")
  imageUrl: string;

  get imageId() {
    return this._imageId;
  }

  set imageId(val) {
    this._imageId = val;
    this.propagateChange(this._imageId);
  }

  propagateChange = (_: any) => {};

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    const selectedFile = <File>event.target.files[0];
    if (selectedFile) {
      this.imageService.createImage(selectedFile).subscribe(
        (data: any) => {
          this.imageId = data.id;
          this.imageUrl = data.imageUrls[500];
        }
      );
    }
  }

  writeValue(obj: any): void {
    this.imageId = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void { }

  downloadImage(image: string) {
    this.imageService.downloadMovieDbImage(image).subscribe(
      (data: any) => {
        this.imageId = data.id;
        this.imageUrl = data.imageUrls[500]
      }
    );
  }

}
