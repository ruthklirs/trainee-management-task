import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Trainee } from 'src/app/models/trainee .model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>, private dataService: DataService) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(user: any) {
    this.dialogRef.close(user);
  }

  addTrainee(newTrainee: Trainee) {
    this.dataService.addTrainee(newTrainee).subscribe(() => {
    }, (error) => {
      console.error('Error adding trainee:', error);
    });
  }
}
