import { FormControl } from '@angular/forms';

export interface GameForm {
  readonly name: FormControl<string>;
  readonly type: FormControl<string>;
  readonly price: FormControl<string>;
  readonly multiplayer: FormControl<boolean>;
  readonly singleplayer: FormControl<boolean>;
  readonly logoUrl: FormControl<string>;
}

export interface GameRequest {
  readonly name: string;
  readonly type: string;
  readonly price: string;
  readonly multiplayer: boolean;
  readonly singleplayer: boolean;
  readonly logoUrl: string;
}
