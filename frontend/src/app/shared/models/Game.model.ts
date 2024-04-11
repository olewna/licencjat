export interface Game {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly price: string;
  readonly createdAt: string;
  readonly singleplayer: boolean;
  readonly multiplayer: boolean;
  readonly logoUrl: string;
  readonly author: string;
}
