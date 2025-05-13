import { Routes } from '@angular/router';
import { BirthdayFormComponent } from './birthday-form/birthday-form.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';

export const routes: Routes = [
  { path: '', component: BirthdayFormComponent },
  { path: 'list', component: EmployeesListComponent },
  { path: '**', redirectTo: '' },
];
