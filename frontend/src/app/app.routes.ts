// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayersListComponent } from './pages/players-list/players-list.component';
import { PlayerDetailComponent } from './pages/player-detail/player-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my-profile', component: ProfileEditComponent },
  { path: '**', redirectTo: '' },
];
