import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BirthdayService } from '../services/birthday.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-birthday-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIcon,

    MatSpinner,
  ],
  templateUrl: './birthday-form.component.html',
  styleUrls: ['./birthday-form.component.scss'],
})
export class BirthdayFormComponent {
  private fb = inject(FormBuilder);
  private svc = inject(BirthdayService);

  form = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    birthdate: [null, Validators.required],
  });

  submitting = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting = true;

    const name = this.form.value.name!;
    const surname = this.form.value.surname!;
    const d = this.form.value.birthdate! as Date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;

    this.svc.addBirthday({ name, surname, birthdate: localDate }).subscribe({
      next: () => {
        alert('Birthday added!');
        this.form.reset();
        this.submitting = false;
      },
      error: (err) => {
        alert('Error: ' + err.message);
        this.submitting = false;
      },
    });
  }
  private router = inject(Router);
  navigateToImport(): void {
    this.router.navigate(['/import-birthdays']);
  }
}
