// filepath: c:\Users\D1n\OneDrive\Desktop\Manage Birthday Bot\manage-birthday\src\app\app.routes.ts
import { Routes } from '@angular/router';
import { BirthdayFormComponent } from './birthday-form/birthday-form.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'birthday-form',
    loadComponent: () =>
      import('./birthday-form/birthday-form.component').then(
        (m) => m.BirthdayFormComponent
      ),
  },
  {
    path: 'employees-list',
    loadComponent: () =>
      import('./employees-list/employees-list.component').then(
        (m) => m.EmployeesListComponent
      ),
  },
];
