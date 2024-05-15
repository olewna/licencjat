import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MainModule } from '../../main.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/shared/services/auth.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent],
      imports: [MainModule, HttpClientTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isLogged: () => {
              return true;
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
