export interface User {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly image: string;
  readonly favouriteCombos: Combo[];
}

export interface LoggedUser {
  readonly _id: string;
  readonly name: string;
  readonly type: string;
  readonly password: string;
  readonly email: string;
  readonly image: string;
  readonly favouriteCombos: Combo[];
}

export interface Combo {
  readonly foodId: string;
  readonly gameId: string;
  readonly musicId: string;
}

export interface UserEdit {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly image: string;
}

export interface UserResponse {
  readonly userToken: string;
  readonly user: LoggedUser;
}
