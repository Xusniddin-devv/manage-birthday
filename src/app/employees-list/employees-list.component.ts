import { Component, OnInit, inject } from '@angular/core';
import { BirthdayService, Colleague } from '../services/birthday.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-employees-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  private svc = inject(BirthdayService);
  colleagues: Colleague[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadColleagues();
  }

  loadColleagues() {
    this.isLoading = true;
    this.error = null;
    this.svc
      .fetchAll()
      .pipe(
        tap((response) => {
          this.colleagues = response;
        }),
        catchError((err) => {
          this.error = `Failed to load colleagues: ${
            err.message || 'Unknown error'
          }`;
          console.error('Error loading colleagues:', err);
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
  deleteColleague(idx: number) {
    if (idx < 0 || idx >= this.colleagues.length) {
      console.error('Invalid index for delete:', idx);
      return;
    }

    const colleagueToDelete = this.colleagues[idx];
    if (
      !confirm(`Remove ${colleagueToDelete.name} ${colleagueToDelete.surname}?`)
    ) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const updatedColleagues = this.colleagues.filter(
      (_, index) => index !== idx
    );

    this.svc
      .saveAll(updatedColleagues)
      .pipe(
        tap(() => {
          this.colleagues = updatedColleagues;
          console.log(
            `${colleagueToDelete.name} ${colleagueToDelete.surname} deleted and list saved.`
          );
        }),
        catchError((err) => {
          this.error = `Failed to delete ${colleagueToDelete.name}: ${
            err.message || 'Unknown error'
          }`;
          console.error('Error deleting colleague:', err);
          return EMPTY;
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }
}
