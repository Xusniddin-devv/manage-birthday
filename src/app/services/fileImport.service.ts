import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { Colleague } from './birthday.service';

export interface ImportResult {
  data: Colleague[];
  validRows: number;
  invalidRows: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileImportService {
  private importResultSubject = new BehaviorSubject<ImportResult | null>(null);
  public importResult$ = this.importResultSubject.asObservable();

  constructor() {}

  parseFile(file: File): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // Convert to JSON with header row
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Process data
          const result = this.processImportedData(jsonData);
          this.importResultSubject.next(result);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsBinaryString(file);
    });
  }

  private processImportedData(rows: any[]): ImportResult {
    const result: ImportResult = {
      data: [],
      validRows: 0,
      invalidRows: 0,
      errors: [],
    };

    // Skip header row (index 0)
    if (rows.length < 2) {
      result.errors.push({
        row: 0,
        message: 'File contains no data rows',
      });
      return result;
    }

    // Process data rows (skip header at index 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      // Skip empty rows
      if (!row || row.length === 0) continue;

      try {
        // Expecting: name, surname, birthdate
        if (row.length < 3) {
          throw new Error('Row has fewer than required columns');
        }

        // Validate birthdate format (YYYY-MM-DD)
        const birthdate = this.formatBirthdate(row[2]);
        if (!this.isValidDate(birthdate)) {
          throw new Error('Invalid birthdate format');
        }

        const colleague: Colleague = {
          name: String(row[0] || '').trim(),
          surname:
            String(row[1] || '').trim() === '-'
              ? ''
              : String(row[1] || '').trim(),
          birthdate: birthdate,
        };

        // Additional validations
        if (!colleague.name) throw new Error('Name is required');
        // Modify surname validation to allow empty values when dash is used
        if (colleague.surname === '' && String(row[1] || '').trim() !== '-') {
          throw new Error('Surname is required or use "-" as placeholder');
        }
        result.data.push(colleague);
        result.validRows++;
      } catch (error) {
        result.invalidRows++;
        result.errors.push({
          row: i + 1, // +1 for human-readable row numbers
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  private formatBirthdate(value: any): string {
    if (!value) return '';

    // If already in YYYY-MM-DD format, return as is
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Handle Excel date serial number
    if (typeof value === 'number') {
      const date = XLSX.SSF.parse_date_code(value);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(
        date.d
      ).padStart(2, '0')}`;
    }

    // Try to parse as date string
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(date.getDate()).padStart(2, '0')}`;
      }
    } catch (e) {
      // Fall through to error
    }

    return value;
  }

  private isValidDate(dateString: string): boolean {
    // Check format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

    // Check if valid date
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  clearImportResult(): void {
    this.importResultSubject.next(null);
  }

  // Helper to generate a template file
  generateTemplateFile(): void {
    // Create worksheet with header
    const ws = XLSX.utils.aoa_to_sheet([
      ['Name', 'Surname', 'Birthdate (YYYY-MM-DD)'],
    ]);

    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BirthdayTemplate');

    // Generate Excel file
    XLSX.writeFile(wb, 'birthday-template.xlsx');
  }
}
