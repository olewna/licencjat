export interface Music {
  readonly id: string;
  readonly name: string;
  readonly author: string;
  readonly length: string;
  readonly type: string;
  readonly createdAt: string;
  readonly service: string[];
  readonly image: string;
  readonly user: string;
}

export interface Services {
  readonly name: string;
  readonly checked: boolean;
}
