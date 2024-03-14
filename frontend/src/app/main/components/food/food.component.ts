import { Component, OnInit } from '@angular/core';
import { Food } from 'src/app/shared/models/Food.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {
  public constructor(private crudService: ComboService) {}

  public ngOnInit(): void {
    this.loadFood();
  }

  protected loadFood(): void {
    this.crudService.getFood(this.page).subscribe({
      next: (val) => {
        this.foodList = [...this.foodList, ...val.food];
        if (val.allPages > this.page) {
          this.page++;
        } else {
          this.isNextPage = false;
        }
      },
    });
  }

  protected isNextPage: boolean = true;
  protected page: number = 1;
  protected foodList: Food[] = [];
}
