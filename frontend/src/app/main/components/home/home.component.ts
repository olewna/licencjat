import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from 'src/app/shared/models/Food.model';
import { Game } from 'src/app/shared/models/Game.model';
import { Music } from 'src/app/shared/models/Music.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';
import { UserService } from '../../../shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Combo } from 'src/app/shared/models/User.model';

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
  protected favouriteCombo: boolean = false;

  public ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (user) => {
        if (user) {
          this.loggedUserId = user._id;
          this.userService.getTodayCombo(user._id).subscribe({
            next: (combo) => {
              this.checkIfFav(this.loggedUserId, combo);
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
        const combo = {
          foodId: foodResult.id,
          gameId: gameResult.id,
          musicId: musicResult.id,
        };

        if (this.loggedUserId) {
          this.checkIfFav(this.loggedUserId, combo);
          this.userService.saveTodayCombo(this.loggedUserId, combo).subscribe({
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
    this.userService
      .addToFavourite(this.loggedUserId, {
        foodId: this.todayFood!.id,
        gameId: this.todayGames!.id,
        musicId: this.todayMusic!.id,
      })
      .subscribe({
        next: () => {
          this.favouriteCombo = true;
          //todo jakies powiadomienie ze sie udalo dodac
        },
      });
  }
  public deleteFromFavourite(): void {
    this.userService
      .deleteFromFavourite(this.loggedUserId, {
        foodId: this.todayFood!.id,
        gameId: this.todayGames!.id,
        musicId: this.todayMusic!.id,
      })
      .subscribe({
        next: () => {
          this.favouriteCombo = false;
          //todo jakies powiadomienie ze sie udalo usunac
        },
      });
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
        this.checkIfFav(this.loggedUserId, {
          foodId: val.id,
          gameId: this.todayGames!.id,
          musicId: this.todayMusic!.id,
        });
        this.saveSingleElementInCombo('food', val.id);
      },
    });
  }

  public rollGame(): void {
    this.comboService.getRandomGame().subscribe({
      next: (val) => {
        this.todayGames = val as Game;
        this.checkIfFav(this.loggedUserId, {
          foodId: this.todayFood!.id,
          gameId: val.id,
          musicId: this.todayMusic!.id,
        });
        this.saveSingleElementInCombo('game', val.id);
      },
    });
  }

  public rollMusic(): void {
    this.comboService.getRandomMusic().subscribe({
      next: (val) => {
        this.todayMusic = val as Music;
        this.checkIfFav(this.loggedUserId, {
          foodId: this.todayFood!.id,
          gameId: this.todayGames!.id,
          musicId: val.id,
        });
        this.saveSingleElementInCombo('music', val.id);
      },
    });
  }

  private checkIfFav(id: string, combo: Combo): void {
    this.userService.checkIfComboIsFavourite(id, combo).subscribe({
      next: (val) => {
        this.favouriteCombo = val;
      },
      error: (err: HttpErrorResponse) => {
        this.favouriteCombo = false;
        console.log('ERROR: ' + err.error.message);
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
