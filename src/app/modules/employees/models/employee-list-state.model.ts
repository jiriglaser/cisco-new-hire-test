import { SortDirection } from '@angular/material/sort';

import { Employee } from './employee.model';

export interface EmployeeListState {
  pageIndex: number;
  pageSize: number;
  sortField: keyof Employee;
  sortDirection: SortDirection;
}
