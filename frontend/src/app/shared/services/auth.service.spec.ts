import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { LoggedUser } from '../models/User.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JwtHelperService, JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useValue: {
              tokenGetter: () => {
                return localStorage.getItem('token');
              },
            },
          },
        }),
      ],
      providers: [AuthService, JwtHelperService],
    });
  });

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should return username', () => {
    const service: AuthService = TestBed.inject(AuthService);

    const fakeUser: LoggedUser = {
      _id: '12345',
      name: 'fakeUser',
      type: 'user',
      password: 'password',
      email: 'email@sth.com',
      image: 'fakeImageUrl',
      favouriteCombos: [],
    };

    service.setCurrentUser(fakeUser, 'fakeToken');

    const username: string = service.getUser();
    const result: boolean = username === 'fakeUser';

    expect(result).toBeTrue();
  });
});
