import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BirthdayService, Colleague } from '../services/birthday.service';
import { Subscription } from 'rxjs';
import {
  FileImportService,
  ImportResult,
} from '../services/fileImport.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-with-file',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './add-with-file.component.html',
  styleUrl: './add-with-file.component.scss',
})
export class AddWithFileComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'surname', 'birthdate'];
  isUploading = false;
  importResult: ImportResult | null = null;
  fileName: string = '';

  private subscription = new Subscription();

  constructor(
    private fileImportService: FileImportService,
    private birthdayService: BirthdayService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.fileImportService.importResult$.subscribe((result) => {
        this.importResult = result;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.fileImportService.clearImportResult();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.fileName = file.name;
    this.isUploading = true;

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      this.snackBar.open('Please upload a valid Excel or CSV file', 'Close', {
        duration: 5000,
      });
      this.isUploading = false;
      return;
    }

    this.fileImportService
      .parseFile(file)
      .then((result) => {
        this.isUploading = false;
        if (result.validRows === 0) {
          this.snackBar.open('No valid data rows found in the file', 'Close', {
            duration: 5000,
          });
        }
      })
      .catch((error) => {
        console.error('Error parsing file:', error);
        this.isUploading = false;
        this.snackBar.open(
          'Failed to parse file. Please check the format.',
          'Close',
          { duration: 5000 }
        );
      });
  }

  saveData(): void {
    if (!this.importResult || this.importResult.data.length === 0) {
      this.snackBar.open('No valid data to save', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;

    // Use the existing service to save all colleagues
    this.birthdayService.saveAll(this.importResult.data).subscribe({
      next: () => {
        this.isUploading = false;
        this.snackBar.open(
          `Successfully imported ${this.importResult?.validRows} birthday records`,
          'Close',
          { duration: 5000 }
        );
        this.resetImport();
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error saving data:', error);
        this.snackBar.open('Failed to save data', 'Close', { duration: 5000 });
      },
    });
  }

  downloadTemplate(): void {
    this.fileImportService.generateTemplateFile();
  }

  resetImport(): void {
    this.fileImportService.clearImportResult();
    this.fileName = '';
    // Clear the file input value
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
