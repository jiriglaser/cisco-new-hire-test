import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { Employee } from '../../models/employee.model';
import { EmployeeApiService } from '../../services/employeeApi.service';
import { EmployeeListDataSource } from './employee-list-datasource';

@Component({
  selector: 'empl-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent {
  employeeListDataSource: EmployeeListDataSource;

  displayedColumns: Array<keyof Employee> = ['name', 'jobTitle', 'tenure', 'gender'];

  pageChange: (page: PageEvent) => void;

  sortChange: (sort: Sort) => void;

  constructor(
    private employeeApiService: EmployeeApiService,
  ) {
    this.employeeListDataSource = new EmployeeListDataSource(
      this.employeeApiService,
      { pageIndex: 0, pageSize: 10, sortField: 'name', sortDirection: 'asc' },
    );
    this.pageChange = this.employeeListDataSource.pageChange;
    this.sortChange = this.employeeListDataSource.sortChange;
  }
}
