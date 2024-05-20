import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Trainee } from 'src/app/models/trainee .model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-monitor-page',
  templateUrl: './monitor-page.component.html',
  styleUrls: ['./monitor-page.component.scss']
})
export class MonitorPageComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'average', 'exams'];
  filteredTrainees: Trainee[];
  filterStatus: string;
  examsCount: { [key: string]: number } = {};
  averageGrades: { [key: string]: number } = {};
  private filterSubject = new Subject<string>();

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.initializeData();

    this.dataService.getExamsCountByStudent().subscribe(
      examsCount => {
        this.examsCount = examsCount;
      },
      error => {
        console.error('Error fetching exams count:', error);
      }
    );

    this.dataService.getAverageGradesByStudent().subscribe(
      averageGrades => {
        this.averageGrades = averageGrades;
      },
      error => {
        console.error('Error fetching average grades:', error);
      }
    );
  }

  initializeData(): void {
    if (this.dataService.trainees) {
      this.filteredTrainees = this.dataService.trainees;
    }

    if (this.dataService.idFilter) {
      this.applyIdFilter();
    }

    if (this.dataService.nameFilter) {
      this.applyNameFilter();
    }

    if (!this.dataService.idFilter && !this.dataService.nameFilter) {
      this.fetchTrainees();
    }

    this.filterStatus = this.dataService.filterStatus || 'both';
  }

  fetchTrainees(): void {
    this.dataService.getTrainees().subscribe(trainees => {
      this.filteredTrainees = this.sortAndRemoveDuplicates(trainees, 'id');
      this.dataService.trainees = trainees;
    });
  }

  applyIdFilter(): void {
    const idFilter = this.dataService.idFilter;
    this.filteredTrainees = idFilter
      ? this.filterTraineesByIds(this.dataService.trainees, idFilter.split(','))
      : this.dataService.trainees;
  }

  applyNameFilter(): void {
    const nameFilter = this.dataService.nameFilter.toLowerCase();
    this.filteredTrainees = nameFilter
      ? this.dataService.trainees.filter(trainee =>
        trainee.name.toLowerCase().includes(nameFilter)
      )
      : this.dataService.trainees;
  }

  applyStatusFilter(): void {
    this.dataService.filterStatus = this.filterStatus;
    this.filteredTrainees = this.dataService.trainees.filter(trainee =>
      this.filterStatus === 'both'
        ? true
        : this.filterStatus === 'passed'
          ? this.isPassed(trainee)
          : !this.isPassed(trainee)
    );
  }

  filterTraineesByIds(trainees: Trainee[], selectedIds: string[]): Trainee[] {
    return selectedIds.length
      ? trainees.filter(trainee => selectedIds.includes(trainee.id))
      : trainees;
  }

  isPassed(trainee: Trainee): boolean {
    return this.averageGrades[trainee.id] >= 65;
  }

  sortAndRemoveDuplicates(array: Trainee[], key: string): Trainee[] {
    const uniqueTrainees = array.reduce((unique, current) => {
      if (!unique.some(item => item[key] === current[key])) {
        unique.push(current);
      }
      return unique;
    }, [] as Trainee[]);
    return uniqueTrainees.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  }
}
