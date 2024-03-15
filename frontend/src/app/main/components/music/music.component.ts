import { Component } from '@angular/core';
import { Music } from 'src/app/shared/models/Music.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent {
  public constructor(private crudService: ComboService) {}

  public ngOnInit(): void {
    this.loadMusic();
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

  protected searchedInput: string = '';
  protected isNextPage: boolean = false;
  protected page: number = 1;
  protected musicList: Music[] = [];
}
