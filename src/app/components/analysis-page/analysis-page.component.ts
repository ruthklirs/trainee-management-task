import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Trainee } from 'src/app/models/trainee .model';
import { DataService } from 'src/app/services/data.service';
import { getSubjectsAndGradesById, sortDataBySubject } from 'src/app/units/helpers/calcFunctions';

@Component({
  selector: 'app-analysis-page',
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss'],
})
export class AnalysisPageComponent implements OnInit {
  trainees: Trainee[] = [];
  chartItems = ['chartByFirstId', 'chartBySubject', 'chartBySecondId'];

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.fetchTrainees();
  }

  fetchTrainees(): void {
    this.dataService.getTrainees().subscribe(
      trainees => {
        this.trainees = trainees;
      },
      error => {
        console.error('Error fetching trainees:', error);
      }
    );
  }

  applyIdFilter(): void {
    const idFilter = this.dataService.idFilter.split(',');
    if (idFilter.length > 0) {
      this.dataService.chartByFirstId = getSubjectsAndGradesById(idFilter[0], this.trainees);
    }
    if (idFilter.length > 1) {
      this.dataService.chartBySecondId = getSubjectsAndGradesById(idFilter[1], this.trainees);
    }
  }

  applySubjectFilter(): void {
    const subjectFilter = this.dataService.subjectFilter.split(',');
    this.dataService.chartBySubject = sortDataBySubject(subjectFilter, this.trainees);
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.chartItems, event.previousIndex, event.currentIndex);
  }
}
