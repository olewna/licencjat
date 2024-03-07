import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [HomeComponent, LoginComponent, AccountComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [],
})
export class MainModule {}
