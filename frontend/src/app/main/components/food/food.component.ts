import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Food } from 'src/app/shared/models/Food.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss'],
})
export class FoodComponent implements OnInit {
  public constructor(
    private crudService: ComboService,
    private authService: AuthService,
    private router: Router
  ) {}

  protected searchedInput: string = '';
  protected isNextPage: boolean = false;
  protected page: number = 1;
  protected foodList: Food[] = [];
  protected isLoggedUser: boolean = false;

  public ngOnInit(): void {
    this.loadFood();
    this.isLoggedUser = this.authService.isLogged();
  }

  public goToForm(): void {
    this.router.navigate(['food', 'form']);
  }

  protected loadFood(): void {
    this.crudService.getFood(this.page, this.searchedInput).subscribe({
      next: (val) => {
        this.foodList = [...this.foodList, ...val.food];
        if (val.allPages > this.page) {
          this.page++;
          this.isNextPage = true;
        } else {
          this.isNextPage = false;
        }
      },
    });
  }

  protected listIsEmptyAfterSearch(): boolean {
    return this.foodList.length === 0 && this.searchedInput !== '';
  }

  protected listIsEmptyNoSearch(): boolean {
    return this.foodList.length === 0 && this.searchedInput === '';
  }

  public handleChange(value: string): void {
    if (value === '') {
      this.search();
    }
  }

  protected search(): void {
    this.foodList = [];
    this.page = 1;
    this.loadFood();
  }
}
