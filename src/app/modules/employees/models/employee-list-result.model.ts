import { Employee } from './employee.model';

export interface EmployeeListResult {
  data: Employee[];
  totalSize: number;
}
