import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodComponent } from './food.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MainModule } from '../../main.module';

describe('FoodComponent', () => {
  let component: FoodComponent;
  let fixture: ComponentFixture<FoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodComponent],
      imports: [HttpClientTestingModule, CommonModule, MainModule],
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
    fixture = TestBed.createComponent(FoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
