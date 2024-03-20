import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from 'src/app/shared/models/Food.model';
import { Game } from 'src/app/shared/models/Game.model';
import { Music } from 'src/app/shared/models/Music.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public constructor(
    private comboService: ComboService,
    private authService: AuthService
  ) {}
  protected notRolled: boolean = true;
  protected todayGames: Game | null = null;
  protected todayFood: Food | null = null;
  protected todayMusic: Music | null = null;
  protected vegetarian: boolean = false;
  protected multiplayer: boolean = false;
  protected singleplayer: boolean = false;

  public ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          console.log('user istnieje');
          // user.todayCombo
          // todo pobieranie combo od uzytkownika jak juz wylosował dzisiaj
        }
      },
    });
  }

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

  public addToFavourite(): void {
    console.log('add');
    //todo zrobic dodawania i sprawdzanie czy combo jest juz polubione
  }

  public isLogged(): boolean {
    return this.authService.isLogged();
  }

  public setFilters(): void {
    this.comboService.setFilters(
      this.vegetarian,
      this.singleplayer,
      this.multiplayer
    );
  }

  public rollFood(): void {
    this.comboService.getRandomFood().subscribe({
      next: (val) => {
        this.todayFood = val as Food;
      },
    });
  }

  public rollGame(): void {
    this.comboService.getRandomGame().subscribe({
      next: (val) => {
        this.todayGames = val as Game;
      },
    });
  }

  public rollMusic(): void {
    this.comboService.getRandomMusic().subscribe({
      next: (val) => {
        this.todayMusic = val as Music;
      },
    });
  }
}
