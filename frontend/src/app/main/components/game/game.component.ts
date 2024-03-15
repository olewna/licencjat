import { Component } from '@angular/core';
import { Game } from 'src/app/shared/models/Game.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  public constructor(private crudService: ComboService) {}

  public ngOnInit(): void {
    this.loadGames();
  }

  protected loadGames(): void {
    this.crudService.getGames(this.page, this.searchedInput).subscribe({
      next: (val) => {
        console.log(val);
        this.gameList = [...this.gameList, ...val.games];
        if (val.allPages > this.page) {
          this.page++;
          this.isNextPage = true;
        } else {
          this.isNextPage = false;
        }
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

  protected searchedInput: string = '';
  protected isNextPage: boolean = false;
  protected page: number = 1;
  protected gameList: Game[] = [];
}
