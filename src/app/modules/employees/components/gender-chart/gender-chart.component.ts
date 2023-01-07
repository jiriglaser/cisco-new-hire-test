import { Component } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

import { EmployeeApiService } from '../../services/employeeApi.service';

@Component({
  selector: 'empl-gender-chart',
  templateUrl: './gender-chart.component.html',
  styleUrls: ['./gender-chart.component.scss'],
})
export class GenderChartComponent {
  data$ = this.employeeApiService.getEmployeeStats('gender');

  colorScheme: Color = {
    name: 'generic',
    group: ScaleType.Ordinal,
    domain: ['#003f5c', '#ffa600'],
    selectable: true,
  };

  constructor(
    private employeeApiService: EmployeeApiService,
  ) {}
}
