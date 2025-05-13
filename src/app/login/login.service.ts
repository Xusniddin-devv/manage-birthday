import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  user$: BehaviorSubject<{ username: string; password: string }> =
    new BehaviorSubject<{ username: string; password: string }>({
      username: '',
      password: '',
    });

  constructor() {}

  login(username: string, password: string): boolean {
    if (username && password) {
      this.user$.next({ username, password });
    }
    return false;
  }

  logout(): void {
    this.user$.next({ username: '', password: '' });
  }

  isLoggedIn(): boolean {
    return (
      this.user$.getValue().username !== '' &&
      this.user$.getValue().password !== ''
    );
  }
}
