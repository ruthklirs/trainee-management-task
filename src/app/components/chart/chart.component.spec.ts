import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { DataService } from 'src/app/services/data.service';
import { of } from 'rxjs';
// import { Trainee } from 'src/app/models/trainee.model';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      providers: [ DataService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart data', () => {
    const chartData = {
      datasets: [
        { data: [1, 2, 3], label: 'Test Data' },
      ],
      labels: ['Label 1', 'Label 2', 'Label 3']
    };
    component.updateChartData(chartData);
    expect(component.chartData).toEqual(chartData);
  });

  it('should simulate data update', () => {
    const chartItem = 'testItem';
    const chartData = {
      data: [1, 2, 3],
      name: 'Test Data',
      labels: ['Label 1', 'Label 2', 'Label 3'],
      isUpdated: true
    };
    dataService[chartItem] = chartData;
    component.chartItemKey = chartItem;
    component.simulateDataUpdate();
    expect(component.chartData).toEqual({
      datasets: [
        { data: [...chartData.data], label: chartData.name },
      ],
      labels: [...chartData.labels]
    });
    expect(component.chartTitle).toEqual(chartData.name);
  });

  it('should clear interval on destroy', () => {
    const spy = spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
