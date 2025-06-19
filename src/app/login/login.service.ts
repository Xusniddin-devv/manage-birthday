import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs'; // Added 'of' import

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userSubject = new BehaviorSubject<{
    username: string;
    password: string;
  } | null>(null);
  user$ = this.userSubject.asObservable(); // Better practice: expose as observable

  isLoggedIn$ = this.user$.pipe(map((user) => user !== null));

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    // Check credentials
    const isValid = email === 'UzLogin' && password === 'Uzlogin123$';

    if (isValid) {
      // Update authentication state with the user object
      this.userSubject.next({ username: email, password: password });
      return of(true);
    } else {
      this.userSubject.next(null); // ensure user is null on failed login
      return of(false);
    }
  }

  logout(): void {
    this.userSubject.next(null); // Use null consistently for logged out state
  }

  isLoggedIn(): boolean {
    return this.userSubject.getValue() !== null;
  }
}
