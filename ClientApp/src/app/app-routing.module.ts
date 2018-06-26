import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent
  },
  {
    path: 'create',
    component: CreateMovieComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent
  },
  {
    path: 'movie/edit/:id',
    component: EditMovieComponent
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
