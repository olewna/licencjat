import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../models/Food.model';
import { Music } from '../models/Music.model';
import { Game } from '../models/Game.model';

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  constructor(private httpClient: HttpClient) {}

  public getRandomFood(): Observable<Food> {
    return this.httpClient.get<Food>('food/random');
  }
  public getRandomMusic(): Observable<Music> {
    return this.httpClient.get<Music>('music/random');
  }
  public getRandomGame(): Observable<Game> {
    return this.httpClient.get<Game>('games/random');
  }
}
