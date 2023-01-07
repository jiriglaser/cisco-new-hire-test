import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { BehaviorSubject, delay, filter, map, Observable, of, takeWhile } from 'rxjs';

import * as DataUtils from '../../../shared/utils/data.utils';
import { EmployeeListResult } from '../models/employee-list-result.model';
import { Employee } from '../models/employee.model';
import { Stats } from '../models/stats.model';

const mockDataPath = '/assets/mocks/employeeData.json';

export const mockHttpDelay = 750;

type EmployeeRaw = { [Property in keyof Employee]: string };

/**
 * Simulates communication with REST API.
 *
 * There is a real initial HTTP request to get the test data from JSON file. After that, all the requests
 * for data coming to this service use private Subject as a means to store employee data (both to get and update the data).
 */
@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private employeeListSubj = new BehaviorSubject<Employee[] | undefined>(undefined);

  constructor(
    private http: HttpClient,
  ) {
    // initial request to get the test data
    this.http.get<EmployeeRaw[]>(mockDataPath)
      .pipe(
        map(this.parseData),
      )
      .subscribe((employeeList) => {
        this.employeeListSubj.next(employeeList);
      });
  }

  /** Get employee list. */
  getEmployees(pageIndex: number, pageSize: number, sortField: keyof Employee, sortDirection: SortDirection): Observable<EmployeeListResult> {
    return this.employeeListSubj
      .pipe(
        // In case the test data hasn't arrived yet, wait. Otherwise return the value and complete the stream.
        takeWhile((employeeList) => !employeeList, true),
        filter(Boolean),
        // The following transformations are needed because we don't have any real backend. If we had it, the server response would already be paged+sorted.
        map((employeeList) => this.cloneEmployees(employeeList)), // employeeListSubj holds always the same data - we should ensure data immutability
        map((employeeList) => this.getEmployeesSorted(employeeList, sortField, sortDirection)),
        map((employeeList) => ({
          data: this.getEmployeesPage(employeeList, pageIndex, pageSize),
          totalSize: employeeList.length,
        })),
        // mimick network latency
        delay(mockHttpDelay),
      );
  }

  /** Get employee statistics for a given employee property. */
  getEmployeeStats(field: keyof Employee): Observable<Stats> {
    return this.employeeListSubj
      .pipe(
        // In case the test data hasn't arrived yet, wait. Otherwise return the value and complete the stream.
        takeWhile((employeeList) => !employeeList, true), // mimick HTTP request which completes after returning a value
        filter(Boolean),
        map((employeeList) => DataUtils.getValueStats(employeeList, field)),
        map((valuesMap) => Array.from( // map from Map to format consumed by chart components
          valuesMap,
          ([name, value]) => ({ name, value }),
        )),
      );
  }

  addEmployee(employee: Employee): Observable<boolean> {
    const currentList = this.employeeListSubj.value ?? [];
    this.employeeListSubj.next(
      [...currentList, employee],
    );
    return of(true);
  }

  private cloneEmployees(employeeList: Employee[]): Employee[] {
    return [
      ...employeeList.map((item) => ({ ...item })),
    ];
  }

  private getEmployeesPage(employeeList: Employee[], pageIndex: number, pageSize: number): Employee[] {
    const startIndex = pageIndex * pageSize;
    return employeeList.slice(startIndex, startIndex + pageSize);
  }

  private getEmployeesSorted(employeeList: Employee[], sortField: keyof Employee, sortDirection: SortDirection): Employee[] {
    return [...employeeList].sort((a, b) => {
      const isAsc = sortDirection === 'asc';
      return DataUtils.compare(a[sortField], b[sortField], isAsc);
    });
  }

  private parseData = (employeeListStr: EmployeeRaw[]): Employee[] => {
    return employeeListStr.map((employee) => ({
      ...employee,
      tenure: Number(employee.tenure),
      gender: employee.gender === 'Female' ? 'Female' : 'Male',
    }));
  };
}
