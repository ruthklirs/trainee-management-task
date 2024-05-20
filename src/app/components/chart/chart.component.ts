import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BubbleDataPoint, ChartData, ChartTypeRegistry, ScatterDataPoint } from 'chart.js';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() chartItemKey: string;
  @Input() chartIndex: number;

  chartTitle: string;
  private updateIntervalId: any;
  public chartType: keyof ChartTypeRegistry = 'bar';
  public chartData: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], string> = {
    datasets: [],
    labels: []
  };
  public chartOptions: any = {
    responsive: true
  };

  constructor(private dataService: DataService) {}

  /**
   * Updates the chart data with new data.
   * @param newData - New chart data.
   */
  updateChartData(newData: ChartData<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], string>) {
    this.chartData = newData;
  }

  /**
   * Simulates data update by fetching new data from the data service.
   */
  simulateDataUpdate() {
    const newData = {
      datasets: [
        { data: [...this.dataService?.[this.chartItemKey]?.data], label: this.dataService?.[this.chartItemKey]?.name },
      ],
      labels: [...this.dataService?.[this.chartItemKey]?.labels]
    };
    this.updateChartData(newData);
    this.chartTitle = this.dataService?.[this.chartItemKey]?.name;
  }

  ngOnInit(): void {
    if (this.dataService?.[this.chartItemKey]) {
      this.dataService[this.chartItemKey].isUpdated = true;
    }
    this.updateIntervalId = setInterval(() => {
      if (this.dataService?.[this.chartItemKey]?.isUpdated) {
        this.simulateDataUpdate();
        this.dataService[this.chartItemKey].isUpdated = false;
      }
    }, 2000); // 2 seconds interval
  }

  ngOnDestroy() {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
  }
}
