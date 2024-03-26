import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game } from 'src/app/shared/models/Game.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public constructor(
    private crudService: ComboService,
    private authService: AuthService,
    private router: Router
  ) {}

  protected searchedInput: string = '';
  protected isNextPage: boolean = false;
  protected page: number = 1;
  protected gameList: Game[] = [];
  protected isLoggedUser: boolean = false;

  public ngOnInit(): void {
    this.loadGames();
    this.isLoggedUser = this.authService.isLogged();
  }

  public goToForm(): void {
    this.router.navigate(['games', 'form']);
  }

  protected loadGames(): void {
    this.crudService.getGames(this.page, this.searchedInput).subscribe({
      next: (val) => {
        this.gameList = [...this.gameList, ...val.games];
        if (val.allPages > this.page) {
          this.page++;
          this.isNextPage = true;
        } else {
          this.isNextPage = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  protected listIsEmptyAfterSearch(): boolean {
    return this.gameList.length === 0 && this.searchedInput !== '';
  }

  protected listIsEmptyNoSearch(): boolean {
    return this.gameList.length === 0 && this.searchedInput === '';
  }

  public handleChange(value: string): void {
    if (value === '') {
      this.search();
    }
  }

  protected search(): void {
    this.gameList = [];
    this.page = 1;
    this.loadGames();
  }
}
