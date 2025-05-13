import { Routes } from '@angular/router';

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
