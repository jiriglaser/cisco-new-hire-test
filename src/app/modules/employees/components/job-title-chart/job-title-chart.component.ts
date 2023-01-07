import { Component, OnDestroy } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { shareReplay, Subscription } from 'rxjs';

import { Stats } from '../../models/stats.model';
import { EmployeeApiService } from '../../services/employeeApi.service';

/**
 * Compare this component to `GenderChartComponent`. All the stuff that you see in addition here
 * is just to make chart labels to show e.g. 'Developer: 5', not just 'Developer'.
 */
@Component({
  selector: 'empl-job-title-chart',
  templateUrl: './job-title-chart.component.html',
  styleUrls: ['./job-title-chart.component.scss'],
})
export class JobTitleChartComponent implements OnDestroy {
  data$ = this.employeeApiService.getEmployeeStats('jobTitle')
    .pipe(shareReplay(1));

  dataValue?: Stats;

  colorScheme: Color = {
    name: 'generic',
    group: ScaleType.Ordinal,
    domain: ['#ffa600', '#ff7c43', '#f95d6a', '#d45087', '#a05195', '#665191', '#2f4b7c', '#003f5c'],
    selectable: true,
  };

  private subscription: Subscription;

  constructor(
    private employeeApiService: EmployeeApiService,
  ) {
    this.subscription = this.data$.subscribe((data) => {
      this.dataValue = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  enhanceLabel = (jobTitle: string): string => {
    if (this.dataValue) {
      const valueCount = this.dataValue.find(({ name }) => name === jobTitle)?.value ?? 0;
      return `${jobTitle}: ${valueCount}`;
    }
    return jobTitle;
  };
}
