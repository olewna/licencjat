import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from 'src/app/shared/models/Food.model';
import { Game } from 'src/app/shared/models/Game.model';
import { Music } from 'src/app/shared/models/Music.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';
import { UserService } from '../../../shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public constructor(
    private comboService: ComboService,
    private authService: AuthService,
    private userService: UserService
  ) {}
  protected notRolled: boolean = true;
  protected todayGames: Game | null = null;
  protected todayFood: Food | null = null;
  protected todayMusic: Music | null = null;
  protected vegetarian: boolean = false;
  protected multiplayer: boolean = false;
  protected singleplayer: boolean = false;
  private loggedUserId: string = '';

  public ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.loggedUserId = user._id;
          this.userService.getTodayCombo(user._id).subscribe({
            next: (combo) => {
              const todayFood = this.comboService.getFoodById(combo.foodId);
              const todayGame = this.comboService.getGameById(combo.gameId);
              const todayMusic = this.comboService.getMusicById(combo.musicId);
              forkJoin([todayFood, todayMusic, todayGame]).subscribe({
                next: ([food, music, game]) => {
                  this.todayFood = food;
                  this.todayMusic = music;
                  this.todayGames = game;
                  this.notRolled = false;
                },
              });
            },
            error: (err: HttpErrorResponse) => {
              console.log(err.error.message);
            },
          });
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

        if (this.loggedUserId) {
          this.userService
            .saveTodayCombo(this.loggedUserId, {
              foodId: foodResult.id,
              gameId: gameResult.id,
              musicId: musicResult.id,
            })
            .subscribe({
              next: () => {
                this.notRolled = false;
              },
              error: (err: HttpErrorResponse) => {
                console.log(err.error.message);
              },
            });
        } else {
          this.notRolled = false;
        }
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
        this.saveSingleElementInCombo('food', val.id);
      },
    });
  }

  public rollGame(): void {
    this.comboService.getRandomGame().subscribe({
      next: (val) => {
        this.todayGames = val as Game;
        this.saveSingleElementInCombo('game', val.id);
      },
    });
  }

  public rollMusic(): void {
    this.comboService.getRandomMusic().subscribe({
      next: (val) => {
        this.todayMusic = val as Music;
        this.saveSingleElementInCombo('music', val.id);
      },
    });
  }

  private saveSingleElementInCombo(type: string, id: string): void {
    if (this.loggedUserId) {
      this.userService
        .updateOneElementInCombo(this.loggedUserId, { type, id })
        .subscribe({
          error: (err: HttpErrorResponse) => {
            console.log(err.error.message);
          },
        });
    }
  }
}
