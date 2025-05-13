import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Colleague {
  name: string;
  surname: string;
  birthdate: string;
}

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private http = inject(HttpClient);
  private jsonBinUrl = `https://api.jsonbin.io/v3/b/${environment.jsonBin.id}`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Master-Key': environment.jsonBin.key,
    });
  }

  fetchAll(): Observable<Colleague[]> {
    return this.http
      .get<any>(this.jsonBinUrl, { headers: this.getHeaders() })
      .pipe(
        map((response) => {
          // Case 1: The response is directly the array of colleagues (as per your JSONBin data)
          if (Array.isArray(response)) {
            return response as Colleague[];
          }
          // Case 2: The response is an object, and colleagues are under a 'record' key
          // This is a common pattern for JSONBin if the bin was created to hold a structured object.
          if (
            response &&
            typeof response === 'object' &&
            Array.isArray(response.record)
          ) {
            return response.record as Colleague[];
          }
          // Case 3: The response is an object but not in the expected structure,
          // or it's null/undefined when the bin is empty or uninitialized.
          // Log an error and return an empty array to prevent *ngFor issues.
          if (response !== null && !Array.isArray(response)) {
            console.warn(
              'fetchAll received an unexpected data structure:',
              response
            );
          }
          return []; // Default to an empty array
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(
            'Error fetching colleagues from BirthdayService:',
            error
          );
          // Let the component's error handler deal with displaying the message.
          // Rethrow the error or return an observable error.
          return throwError(() => error);
        })
      );
  }

  saveAll(cols: Colleague[]): Observable<void> {
    // Assuming your JSONBin stores the array directly at the root
    return this.http
      .put<void>(this.jsonBinUrl, cols, { headers: this.getHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error saving colleagues in BirthdayService:', error);
          return throwError(() => error);
        })
      );
  }

  addBirthday(col: Colleague): Observable<void> {
    return this.fetchAll().pipe(
      take(1), // fetchAll now handles empty/null cases by returning []
      switchMap((currentColleagues) => {
        const updatedColleagues = [...currentColleagues, col];
        return this.saveAll(updatedColleagues);
      })
      // catchError can be added here if specific error handling for addBirthday is needed
      // otherwise, errors from fetchAll/saveAll will propagate
    );
  }
}
