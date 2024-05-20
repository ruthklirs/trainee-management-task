import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Trainee } from '../models/trainee .model';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private _chartByFirstId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public chartByFirstId$ = this._chartByFirstId.asObservable();

  private _chartBySubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public chartBySubject$ = this._chartBySubject.asObservable();

  private _chartBySecondId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public chartBySecondId$ = this._chartBySecondId.asObservable();

  public trainees;
  public tempTrainees;
  public averageGradesMap;
  public filterStatus = 'both';
  public idFilter: string='';
  public filterValue: string = '';
  public filterData:string;
  public nameFilter:string;

  public analysisPageIdFilter;
  public subjectFilter;
  private baseUrl = 'http://localhost:3000/trainees';

  setFilterValue(value: string): void {
    this.filterValue = value;
  }

  getFilterValue(): string {
    return this.filterValue;
  }

  get chartByFirstId(): any {
    return this._chartByFirstId.value;
  }

  set chartByFirstId(value: any) {
    this._chartByFirstId.next(value);
  }
  get chartBySubject(): any {
    return this._chartBySubject.value;
  }

  set chartBySubject(value: any) {
    this._chartBySubject.next(value);
  }
  get chartBySecondId(): any {
    return this._chartBySecondId.value;
  }

  set chartBySecondId(value: any) {
    this._chartBySecondId.next(value);
  }

  constructor(private http: HttpClient) { }

  getTrainees(): Observable<Trainee[]> {
    return this.http.get<Trainee[]>(this.baseUrl);
  }

  getTraineeById(id: string): Observable<Trainee> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Trainee>(url);
  }

  deleteTrainee(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  addTrainee(trainee: Trainee): Observable<Trainee> {
    return this.http.post<Trainee>(this.baseUrl, trainee);
  }

  updateTrainee(trainee: Trainee): Observable<Trainee> {
    const url = `${this.baseUrl}/${trainee.id}`;
    return this.http.put<Trainee>(url, trainee);
  }
  fetchTrainees2(): Observable<Trainee[]> {
    return this.http.get<Trainee[]>(this.baseUrl);
  }

  getExamsCountByStudent(): Observable<{ [key: string]: number }> {
    return this.http.get<Trainee[]>(this.baseUrl).pipe(
      map(trainees => {
        const examsCountMap: { [key: string]: number } = {};
        trainees.forEach(trainee => {
          if (!examsCountMap[trainee.id]) {
            examsCountMap[trainee.id] = 1;
          } else {
            examsCountMap[trainee.id]++;
          }
        });
        return examsCountMap;
      })
    );
  }
  getGradesByStudent(): Observable<{ [key: string]: number[] }> {
    return this.http.get<Trainee[]>(this.baseUrl).pipe(
      map(trainees => {
        const gradesMap: { [key: string]: number[] } = {};
        trainees.forEach(trainee => {
          if (!gradesMap[trainee.id]) {
            gradesMap[trainee.id] = [trainee.grade];
          } else {
            gradesMap[trainee.id].push(trainee.grade);
          }
        });
        return gradesMap;
      })
    );
  }
  getGradesByStudentId(studentId: string): Observable<number[]> {
    return this.http.get<Trainee[]>(this.baseUrl).pipe(
      map(trainees => {
        const student = trainees.find(trainee => trainee.id === studentId);
        return student ? [student.grade] : []; // Return an array with the student's grade or an empty array if the student is not found
      })
    );
  }

  getAverageGradesByStudent(): Observable<{ [key: string]: number }> {
    return this.http.get<Trainee[]>(this.baseUrl).pipe(
      map(trainees => {
        const averageGradesMap: { [key: string]: number } = {};
        trainees.forEach(trainee => {
          if (!averageGradesMap[trainee.id]) {
            averageGradesMap[trainee.id] = trainee.grade;
          } else {
            averageGradesMap[trainee.id] += trainee.grade;
          }
        });
        // Calculate average grade for each student
        for (const studentId in averageGradesMap) {
          if (averageGradesMap.hasOwnProperty(studentId)) {
            averageGradesMap[studentId] /= trainees.filter(trainee => trainee.id === studentId).length;
          }
        }
        return averageGradesMap;
      })
    );
  }
}