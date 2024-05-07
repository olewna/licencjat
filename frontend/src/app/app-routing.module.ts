import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedGuard, notLoggedGuard } from './core/guards/auth.guard';
import { HomeComponent } from './main/components/home/home.component';
import { LoginComponent } from './main/components/login/login.component';
import { AccountComponent } from './main/components/account/account.component';
import { FoodComponent } from './main/components/food/food.component';
import { MusicComponent } from './main/components/music/music.component';
import { GameComponent } from './main/components/game/game.component';
import { FoodFormComponent } from './main/components/food-form/food-form.component';
import { GameFormComponent } from './main/components/game-form/game-form.component';
import { MusicFormComponent } from './main/components/music-form/music-form.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedGuard],
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    canActivate: [notLoggedGuard],
  },
  {
    path: 'food',
    component: FoodComponent,
  },
  {
    path: 'food/form',
    component: FoodFormComponent,
    canActivate: [notLoggedGuard],
  },
  {
    path: 'music',
    component: MusicComponent,
  },
  {
    path: 'music/form',
    component: MusicFormComponent,
    canActivate: [notLoggedGuard],
  },
  {
    path: 'music/form/:id',
    component: MusicFormComponent,
    canActivate: [notLoggedGuard],
  },
  {
    path: 'games',
    component: GameComponent,
  },
  {
    path: 'games/form',
    component: GameFormComponent,
    canActivate: [notLoggedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
