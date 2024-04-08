import { FormControl } from '@angular/forms';

export interface FoodForm {
  readonly name: FormControl<string>;
  readonly telephone: FormControl<string>;
  readonly company: FormControl<string>;
  readonly owner: FormControl<boolean>;
  readonly vegetarian: FormControl<boolean>;
  readonly image: FormControl<string>;
}

export interface FoodRequest {
  readonly name: string;
  readonly telephone: string;
  readonly company: string;
  readonly owner: boolean;
  readonly vegetarian: boolean;
  readonly image: string;
}
