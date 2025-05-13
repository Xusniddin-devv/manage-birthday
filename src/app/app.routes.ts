// filepath: c:\Users\D1n\OneDrive\Desktop\Manage Birthday Bot\manage-birthday\src\app\app.routes.ts
import { Routes } from '@angular/router';
import { BirthdayFormComponent } from './birthday-form/birthday-form.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'birthday-form', component: BirthdayFormComponent },
  { path: 'employees-list', component: EmployeesListComponent },
  { path: '**', redirectTo: 'login' },
];
