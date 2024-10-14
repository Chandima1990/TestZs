import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { RecordModalComponent } from '../record-modal/record-modal.component';

interface Record {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  records: Record[] = [];
  saving = false;
  pageSize = 20;
  currentPage = 1;
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];

  constructor(private dataService: DataService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadAllRecords();
  }

  loadAllRecords() {
    this.dataService.records$.subscribe({
      next: (allRecords) => {
        this.records = allRecords;
      },
      error: (error) => {
        console.error('Error loading records:', error);
        this.snackBar.open('Error loading records', 'Close', { duration: 3000 });
      }
    });
  }

  openAddRecordModal(): void {
    const dialogRef = this.dialog.open(RecordModalComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assign a new ID to the record (you might want to handle this differently)
        result.id = this.records.length + 1;
        this.records.push(result);
        this.snackBar.open('Record saved successfully', 'Close', { duration: 3000 });
      }
    });
  }

  saveNewRecord(record: any): void {
    // Assign a new ID to the record (you might want to handle this differently)
    record.id = this.records.length + 1;

    this.dataService.saveRecords([record]).subscribe({
      next: () => {
        this.records.push(record);
        this.snackBar.open('Record saved successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error saving record:', error);
        this.snackBar.open('Error saving record', 'Close', { duration: 3000 });
      }
    });
  }

  saveData() {
    if (this.records.length !== 1000) {
      this.snackBar.open('Please load all 1000 records before saving', 'Close', { duration: 3000 });
      return;
    }

    this.saving = true;
    this.dataService.saveRecords(this.records).subscribe({
      next: (response) => {
        this.saving = false;
        this.snackBar.open('Records saved successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error saving records:', error);
        this.saving = false;
        this.snackBar.open('Error saving records: ' + error.message, 'Close', { duration: 5000 });
      }
    });
  }
}

