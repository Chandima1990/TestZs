import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSpinner } from '@angular/material/progress-spinner';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSpinner],
  templateUrl: "./record-modal.component.html",
  styleUrls: ["./record-modal.component.css"]
})
export class RecordModalComponent {
  record: any = {};
  isSaving = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<RecordModalComponent>,
    private dataService: DataService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.isSaving = true;
    this.errorMessage = '';

    this.dataService.saveRecords([this.record]).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(this.record);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = 'Error saving record: ' + error.message;
        console.error('Error saving record:', error);
      }
    });
  }
}
