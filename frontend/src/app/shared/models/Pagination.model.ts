import { Food } from './Food.model';

export interface FoodResponse {
  readonly food: Food[];
  readonly allPages: number;
}
