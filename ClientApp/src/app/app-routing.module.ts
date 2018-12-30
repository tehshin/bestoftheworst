import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { CreateMovieComponent } from './create-movie/create-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent
  },
  {
    path: 'users/join',
    component: CreateUserComponent
  },
  {
    path: 'movie/create',
    component: CreateMovieComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'Administrator'
    }
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent
  },
  {
    path: 'movie/edit/:id',
    component: EditMovieComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: 'Administrator'
    }
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
