import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private router = inject(Router);
  loginService = inject(LoginService);
  private readonly validEmail = 'UzLogin';
  private readonly validPassword = 'Uzlogin123$';

  signInForm!: UntypedFormGroup;
  hide = true;

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  signIn(): void {
    const { email, password } = this.signInForm.value;

    // Disable form during authentication
    this.signInForm.disable();

    // Call login service and react to result
    this.loginService.login(email, password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['birthday-form']);
        } else {
          this.signInForm.enable();
          this.signInForm.setErrors({ invalidCredentials: true });
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.signInForm.enable();
        this.signInForm.setErrors({ serverError: true });
      },
    });
  }
}
