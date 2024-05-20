import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisPageComponent } from './components/analysis-page/analysis-page.component';
import { DataPageComponent } from './components/data-page/data-page.component';
import { MonitorPageComponent } from './components/monitor-page/monitor-page.component';

const routes: Routes = [
  { path: "", component: DataPageComponent },
  { path: "analysis", component: AnalysisPageComponent },
  { path: "data", component: DataPageComponent },
  { path: "monitor", component: MonitorPageComponent },
  { path: "*", component: DataPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
