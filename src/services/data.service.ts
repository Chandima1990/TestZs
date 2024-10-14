import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, retry, tap, throwError } from 'rxjs';

export interface Record {
  id: number;
  name: string;
  email: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private recordsSubject = new BehaviorSubject<Record[]>([]);
  records$ = this.recordsSubject.asObservable();
  private apiUrl = 'http://localhost:3000/api'; // Adjust this to your actual API URL

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<Record[]>('assets/data.json').pipe(
      tap(data => console.log('Loaded initial data:', data)),
      catchError(this.handleError)
    ).subscribe({
      next: (data) => {
        this.recordsSubject.next(data);
      },
      error: (error) => {
        console.error('Error loading data.json:', error);
      }
    });
  }

  getRecords(page: number, limit: number): Observable<Record[]> {
    return this.records$.pipe(
      tap(records => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        console.log(`Getting records for page ${page} with limit ${limit}`);
        console.log('Returning records:', records.slice(startIndex, endIndex));
      })
    );
  }

  saveRecords(records: Record[]): Observable<any> {
    console.log('Saving records:', records);
    return this.http.post(`${this.apiUrl}/save`, records).pipe(
      retry(3), // Retry the request up to 3 times if it fails
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
