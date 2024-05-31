import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-not-found',
  templateUrl: './site-not-found.component.html',
  styleUrls: ['./site-not-found.component.scss'],
})
export class SiteNotFoundComponent {
  public constructor(private router: Router) {}

  public goHome(): void {
    this.router.navigate(['home']);
  }
}
