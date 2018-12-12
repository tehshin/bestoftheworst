import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService extends HttpService {
  
  constructor(httpClient: HttpClient) {
    super(httpClient, '/api/image');
  }

  /**
   * Create a new image from a File
   */
  createImage(file: File): any {
    const formData = new FormData();
    formData.append("imageFile", file, file.name);

    return this.post<any>('', formData);
  }

  /**
   * Downloads an image from TheMovieDb
   */
  downloadMovieDbImage(image: string): any {
    if (image && image[0] === '/') {
      image = image.substr(1);
    }

    return this.get(`download/${image}`);
  }

}
