import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Food } from '../models/Food.model';
import { Music } from '../models/Music.model';
import { Game } from '../models/Game.model';
import {
  FoodResponse,
  GameResponse,
  MusicResponse,
} from '../models/Pagination.model';

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  constructor(private httpClient: HttpClient) {}

  public getRandomFood(): Observable<Food> {
    return this.httpClient.get<Food>('api/food/random');
  }
  public getRandomMusic(): Observable<Music> {
    return this.httpClient.get<Music>('api/music/random');
  }
  public getRandomGame(): Observable<Game> {
    return this.httpClient.get<Game>('api/games/random');
  }

  public getFood(page: number, search: string): Observable<FoodResponse> {
    return this.httpClient.get<FoodResponse>(
      `api/food/search/${search}?pageNumber=${page}`
    );
  }
  public getMusic(page: number, search: string): Observable<MusicResponse> {
    return this.httpClient.get<MusicResponse>(
      `api/music/search/${search}?pageNumber=${page}`
    );
  }
  public getGames(page: number, search: string): Observable<GameResponse> {
    return this.httpClient.get<GameResponse>(
      `api/games/search/${search}?pageNumber=${page}`
    );
  }
}
