import { TestBed } from '@angular/core/testing';

import { ComboService } from './combo.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';

describe('ComboService', () => {
  let service: ComboService;

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
      providers: [ComboService, JwtHelperService],
    });
    service = TestBed.inject(ComboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
