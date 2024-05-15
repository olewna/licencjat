import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { MainModule } from '../../main.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoggedUser } from '../../../shared/models/User.model';
import { BehaviorSubject, filter } from 'rxjs';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const fakeUser: LoggedUser = {
    _id: '12345',
    name: 'fakeUser',
    type: 'user',
    password: 'password',
    email: 'email@sth.com',
    image: 'fakeImageUrl',
    favouriteCombos: [],
  };

  const subjectMock: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(fakeUser);
  const mockDatePickerService = {
    currentUser: subjectMock.asObservable(),
    isLogged: () => {
      return true;
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        MainModule,
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
      providers: [
        JwtHelperService,
        { provide: AuthService, useValue: mockDatePickerService },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
