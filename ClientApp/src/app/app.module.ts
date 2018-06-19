import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesComponent } from './movies/movies.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MovieImageInputComponent } from './movie-image-input/movie-image-input.component';
import { ModalComponent } from './modal/modal.component';
import { Browser } from 'protractor';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { TagInputComponent } from './tag-input/tag-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    CreateMovieComponent,
    MovieDetailComponent,
    NavbarComponent,
    PaginationComponent,
    MovieImageInputComponent,
    ModalComponent,
    EpisodeSelectComponent,
    TagInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
