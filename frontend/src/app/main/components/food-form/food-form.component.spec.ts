import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodFormComponent } from './food-form.component';
import { MainModule } from '../../main.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('FoodFormComponent', () => {
  let component: FoodFormComponent;
  let fixture: ComponentFixture<FoodFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodFormComponent],
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

    fixture = TestBed.createComponent(FoodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
