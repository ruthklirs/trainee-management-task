import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Trainee } from 'src/app/models/trainee .model';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})

export class DataPageComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'subject'];
  dataSource = new MatTableDataSource<Trainee>();
  tempTrainees: Trainee[] = [];
  selectedTrainee: Trainee | null = null;
  detailsAdded: boolean = false;
  private filterSubject = new Subject<string>();
  traineeForm: FormGroup;
  newItemForm: FormGroup;
  editMode: boolean = false;
  selectedRow: Trainee | null = null;
  showAddForm: boolean = false; // Add this property
  editStatus: boolean = false;
  isDisabled: boolean = true;
  isEditing:boolean = false;
  updateUser: Trainee = {
    id: '',
    name: '',
    grade: 0,
    date: '',
    mail: '',
    address: '',
    city: '',
    country: '',
    ZIP: '',
    subject: ''
  }
  constructor(public dataService: DataService, private fb: FormBuilder, private dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  length = 500;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  showFirstLastButtons = true;

  handlePageEvent(event: PageEvent) {
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  pageEvent: PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '400px', // Set the width of the dialog window
      data: {} // You can pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.fetchTrainees2(); // Reload items after deletion
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  selectRow(row: Trainee) {
    this.selectedRow = row;
    this.updateUser = row;
  }

  ngOnInit(): void {
    this.traineeForm = this.fb.group({
      id: [{ value: this.selectedTrainee?.id, disabled: !this.editMode }],
      name: [{ value: this.selectedTrainee?.name, disabled: !this.editMode }],
    });
    if (this.dataService.trainees) {
      this.tempTrainees = this.dataService.trainees;
    } else {
      this.fetchTrainees();
    }
    this.dataSource.data = this.dataService.trainees?.slice(1, 10);
    this.dataSource.paginator = this.paginator;
    if (this.dataService.filterData) {
      this.applyFilter();
    }
  }


  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.traineeForm.enable();
    } else {
      this.traineeForm.disable();
    }
  }

  fetchTrainees(): void {
    this.dataService.getTrainees().subscribe(trainees => {
      this.dataService.trainees = trainees;
      this.tempTrainees = this.sortAndRemoveDuplicates(trainees, 'id');
      this.dataSource = new MatTableDataSource<Trainee>(this.dataService.trainees?.slice(0, this.pageSize));
    });
  }

  applyFilter() {
    const filterValue = this.dataService.filterData.trim().toLowerCase();
    const filterValueSplited = filterValue.split(' ').filter(word => word.trim().length > 0);

    if (filterValueSplited.includes('<') || filterValueSplited.includes('>')) {
      if (filterValueSplited.includes('<')) {
        const symbolValue :number= filterValueSplited.indexOf('<');
        this.tempTrainees = this.dataService.trainees.filter(trainee => {
          return trainee.grade < +filterValueSplited[symbolValue + 1 ] || new Date(trainee.date) < new Date(filterValueSplited[symbolValue + 1 ]);
        });
      } else {
        const symbolValue :number= filterValueSplited.indexOf('>');
        this.tempTrainees = this.dataService.trainees.filter(trainee => {
          return trainee.grade > +filterValueSplited[symbolValue + 1 ] || new Date(trainee.date) > new Date(filterValueSplited[symbolValue + 1 ]);
        });
      }
    } else {
      this.tempTrainees = this.dataService.trainees.filter(trainee => {
        return trainee.name.toLowerCase().includes(filterValue) || trainee.subject.toLowerCase().includes(filterValueSplited[-1])
          || trainee.grade == +filterValue || trainee.id.includes(filterValue) || trainee.date.includes(filterValue);
      });
    }     
  }

  sortAndRemoveDuplicates(array: any[], key: string): any[] {
    // Remove duplicates
    const result = array.reduce((unique, current) => {
      const existing = unique.find(item => item[key] === current[key]);
      if (!existing) {
        return unique.concat([current]);
      } else {
        return unique;
      }
    }, []);
    result.sort((a, b) => (Number(a[key]) > Number(b[key])) ? 1 : ((Number(b[key]) > Number(a[key])) ? -1 : 0));
    return result;
  }


  onInputChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
  }

  showDetails(trainee: Trainee): void {
    this.selectedTrainee = this.selectedTrainee === trainee ? null : trainee;
  }
  saveTraineeDetails(updatedTrainee: Trainee): void {
    this.updateData(updatedTrainee);
  }

  removeData(): void {
    if (!this.selectedRow) {
      // If no trainee is selected, display an error message
      alert("Please select a trainee to delete.");
      return
    }
    this.deleteItem(this.selectedRow.id);
  }

  updateData(updatedTrainee: Trainee): void {
    this.dataService.updateTrainee(updatedTrainee).subscribe(() => {
      const index = this.dataService.trainees.findIndex(trainee => trainee.id === updatedTrainee.id);
      if (index !== -1) {
        this.tempTrainees[index] = updatedTrainee;
        this.dataSource.data = [...this.dataService.trainees]; // Update dataSource with a new array reference
      }
    });
  }

  addItem(newItem: Trainee) {
    this.dataService.addTrainee(newItem).subscribe(() => {
      this.fetchTrainees2(); // Reload items after addition
    });
  }

  deleteItem(id: string) {
    this.dataService.deleteTrainee(id).subscribe(() => {
      this.fetchTrainees2(); // Reload items after deletion
    }, (error) => {
      console.error('Error deleting trainee:', error);
    });

  }

  fetchTrainees2() {
    this.dataService.getTrainees().subscribe((trainees) => {
      this.tempTrainees = trainees;
    }, (error) => {
      console.error('Error fetching trainees:', error);
    });
  }

  getTraineeById(id: string) {
    this.dataService.getTraineeById(id).subscribe(() => {
      this.fetchTrainees(); // Reload items after deletion
    });
  }

  addTrainee(newTrainee: Trainee) {
    this.dataService.addTrainee(newTrainee).subscribe(() => {
      this.fetchTrainees(); // Reload items after adding
    }, (error) => {
      console.error('Error adding trainee:', error);
    });
  }

  updateTrainee(updatedTrainee: Trainee) {
    this.dataService.updateTrainee(updatedTrainee).subscribe(() => {
      this.fetchTrainees(); // Reload items after updating
    }, (error) => {
      console.error('Error updating trainee:', error);
    });
    this.isDisabled = true;
        this.isEditing = false;
  }
  edit() {
    this.isDisabled = false;
    this.isEditing = true;
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }
}
