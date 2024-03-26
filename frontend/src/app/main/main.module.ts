import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './components/account/account.component';
import { FoodComponent } from './components/food/food.component';
import { MusicComponent } from './components/music/music.component';
import { GameComponent } from './components/game/game.component';
import { ChatComponent } from './components/chat/chat.component';
import { FoodFormComponent } from './components/food-form/food-form.component';
import { GameFormComponent } from './components/game-form/game-form.component';
import { MusicFormComponent } from './components/music-form/music-form.component';

@NgModule({
  declarations: [HomeComponent, LoginComponent, AccountComponent, FoodComponent, MusicComponent, GameComponent, ChatComponent, FoodFormComponent, GameFormComponent, MusicFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [],
})
export class MainModule {}
