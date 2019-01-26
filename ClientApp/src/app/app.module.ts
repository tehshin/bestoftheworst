import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { EpisodeSelectComponent } from './episode-select/episode-select.component';
import { GravatarComponent } from './gravatar/gravatar.component';
import { RoleGuard } from './guards/role.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LatestMoviesComponent } from './latest-movies/latest-movies.component';
import { LoginComponent } from './login/login.component';
import { ModalComponent } from './modal/modal.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { MovieImageInputComponent } from './movie-image-input/movie-image-input.component';
import { MovieItemComponent } from './movie-item/movie-item.component';
import { MoviesComponent } from './movies/movies.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AppDataService } from './services/app-data.service';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TruncateTextPipe } from './truncate-text.pipe';

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
        GravatarComponent,
        LoginComponent,
        TruncateTextPipe,
        LatestMoviesComponent,
        MovieItemComponent
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
        RoleGuard,
        {
            provide: APP_INITIALIZER,
            useFactory: (appDataService: AppDataService): any => (): any => appDataService.getAppData(),
            deps: [AppDataService],
            multi: true
        },
        { provide: OAuthStorage, useValue: localStorage },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
