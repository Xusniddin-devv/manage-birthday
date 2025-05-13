import { Component } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  showToolbar: boolean = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showToolbar = event.urlAfterRedirects !== '/login';
      });
  }
}
