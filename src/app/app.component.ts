import { Component, OnInit } from '@angular/core';
import { LoginService } from './login/login.service';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    NgIf,
    AsyncPipe,
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.loginService.isLoggedIn$;
  }
}
