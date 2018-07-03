import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { OAuthModule, OAuthStorage, DefaultOAuthInterceptor } from 'angular-oauth2-oidc';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesComponent } from './movies/movies.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PaginationComponent } from './pagination/pagination.component';
import { MovieImageInputComponent } from './movie-image-input/movie-image-input.component';
import { ModalComponent } from './modal/modal.component';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { AppDataService } from './app-data.service';
import { CreateUserComponent } from './create-user/create-user.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GravatarComponent } from './gravatar/gravatar.component';

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
    TagInputComponent,
    PageNotFoundComponent,
    EditMovieComponent,
    MovieFormComponent,
    CreateUserComponent,
    GravatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    FontAwesomeModule,
    MarkdownModule.forRoot({ 
      loader: HttpClient, 
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          breaks: true
        }
      }
    })
  ],
  providers: [
    AppDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: (appDataService: AppDataService) => () => appDataService.getAppData(),
      deps: [AppDataService],
      multi: true
    },
    { provide: OAuthStorage, useValue: localStorage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
