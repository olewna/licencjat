import { Component } from '@angular/core';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
})
export class FoodFormComponent {
  protected owner: boolean = false;
  protected image: string = '';
  protected setImageUrl(url: string): void {
    this.image = url;
  }
}
