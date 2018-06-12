import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl = "/api/image";

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    const errorMsg = error.message || 'Unable to retrieve data';
    return throwError(errorMsg);
  }

  createImage(file: File) {
    const formData = new FormData();
    formData.append("imageFile", file, file.name);

    return this.http.post(this.baseUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
}
