import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFormComponent } from './account-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MainModule } from '../../main.module';

describe('AccountFormComponent', () => {
  let component: AccountFormComponent;
  let fixture: ComponentFixture<AccountFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountFormComponent],
      imports: [
        HttpClientTestingModule,
        CommonModule,
        MainModule,
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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(AccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
