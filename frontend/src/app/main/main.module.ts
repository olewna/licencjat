import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import * as LR from '@uploadcare/blocks';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { SharedModule } from '../shared/shared.module';
import { AccountFormComponent } from './components/account-form/account-form.component';

LR.registerBlocks(LR);

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    AccountComponent,
    FoodComponent,
    MusicComponent,
    GameComponent,
    ChatComponent,
    FoodFormComponent,
    GameFormComponent,
    MusicFormComponent,
    FileUploaderComponent,
    AccountFormComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainModule {}
