import { Component } from '@angular/core';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
})
export class FoodFormComponent {
  protected files: any[] = [];
  protected owner: boolean = false;

  public handleUploaderEvent(e: Event) {
    const { data: files } = (e as CustomEvent).detail;
    this.files = files;
  }
}
