import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Music } from 'src/app/shared/models/Music.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent implements OnInit {
  public constructor(
    private crudService: ComboService,
    private authService: AuthService,
    private router: Router
  ) {}

  protected searchedInput: string = '';
  protected isNextPage: boolean = false;
  protected page: number = 1;
  protected musicList: Music[] = [];
  protected isLoggedUser: boolean = false;
  protected isModalShowed: boolean = false;

  public ngOnInit(): void {
    this.loadMusic();
    this.isLoggedUser = this.authService.isLogged();
  }

  public goToForm(): void {
    this.router.navigate(['music', 'form']);
  }

  protected loadMusic(): void {
    this.crudService.getMusic(this.page, this.searchedInput).subscribe({
      next: (val) => {
        this.musicList = [...this.musicList, ...val.music];
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
    return this.musicList.length === 0 && this.searchedInput !== '';
  }

  protected listIsEmptyNoSearch(): boolean {
    return this.musicList.length === 0 && this.searchedInput === '';
  }

  public handleChange(value: string): void {
    if (value === '') {
      this.search();
    }
  }

  protected search(): void {
    this.musicList = [];
    this.page = 1;
    this.loadMusic();
  }

  protected goToUpdateForm(): void {
    console.log('update');
  }

  protected showModal(): void {
    this.isModalShowed = true;
  }

  protected cancel(): void {
    this.isModalShowed = false;
  }

  protected confirm(): void {
    console.log('delete');
    this.isModalShowed = false;
  }
}
