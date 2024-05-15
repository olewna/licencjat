import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFormComponent } from './game-form.component';
import { MainModule } from '../../main.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('GameFormComponent', () => {
  let component: GameFormComponent;
  let fixture: ComponentFixture<GameFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameFormComponent],
      imports: [MainModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(GameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
