import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from 'src/app/shared/models/Food.model';
import { Game } from 'src/app/shared/models/Game.model';
import { Music } from 'src/app/shared/models/Music.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(private comboService: ComboService) {}
  protected notRolled: boolean = true;
  protected todayGames: Game | null = null;
  protected todayFood: Food | null = null;
  protected todayMusic: Music | null = null;
  protected vegetarian: boolean = false;

  public roll(): void {
    const randomFood$ = this.comboService.getRandomFood();
    const randomMusic$ = this.comboService.getRandomMusic();
    const randomGame$ = this.comboService.getRandomGame();

    forkJoin([randomFood$, randomMusic$, randomGame$]).subscribe({
      next: ([foodResult, musicResult, gameResult]) => {
        this.todayFood = foodResult as Food;
        this.todayMusic = musicResult as Music;
        this.todayGames = gameResult as Game;

        this.notRolled = false;

        // todo
        // zapisywanie do bazy co wylosował uzytkownik
      },
      error: (error) =>
        console.error('Error occurred in one of the subscriptions: ', error),
    });
  }
}
