import { Food } from './Food.model';
import { Game } from './Game.model';
import { Music } from './Music.model';

export interface FoodResponse {
  readonly food: Food[];
  readonly allPages: number;
}
export interface GameResponse {
  readonly games: Game[];
  readonly allPages: number;
}
export interface MusicResponse {
  readonly music: Music[];
  readonly allPages: number;
}
