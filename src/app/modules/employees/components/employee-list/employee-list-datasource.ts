import { DataSource } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, delay, finalize, map, shareReplay, switchMap } from 'rxjs/operators';

import { EmployeeListResult } from '../../models/employee-list-result.model';
import { EmployeeListState } from '../../models/employee-list-state.model';
import { Employee } from '../../models/employee.model';
import { EmployeeApiService } from '../../services/employeeApi.service';

/**
 * Data source for the EmployeeList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class EmployeeListDataSource extends DataSource<Employee> {
  private listStateSubj: BehaviorSubject<EmployeeListState>;

  private isLoadingSubj = new BehaviorSubject<boolean>(false);

  /** Holds sorting and pagination parameters. These define which data will requested from the API. */
  state$: Observable<EmployeeListState>;

  /** Holds table data. */
  data$: Observable<EmployeeListResult>;

  isLoading$ = this.isLoadingSubj.asObservable().pipe(delay(1)); // the delay is to prevent ExpressionChangedAfterItHasBeenCheckedError

  constructor(
    private employeeApiService: EmployeeApiService,
    initialState: EmployeeListState,
  ) {
    super();
    this.listStateSubj = new BehaviorSubject(initialState);
    this.state$ = this.listStateSubj.asObservable();
    this.data$ = this.listStateSubj.pipe(
      switchMap((params) => this.getEmployees(params)),
      shareReplay(1),
    );
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns {Observable<Employee[]>} A stream of the items to be rendered.
   */
  connect(): Observable<Employee[]> {
    return this.data$.pipe(
      map((result) => result.data),
    );
  }

  /**
   * Called when the table is being destroyed.
   */
  disconnect(): void {
    this.listStateSubj.complete();
    this.isLoadingSubj.complete();
  }

  /**
   * Update table state - page
   */
  pageChange = ({ pageIndex, pageSize }: PageEvent): void => {
    const currentListState = this.listStateSubj.value;
    this.listStateSubj.next({
      ...currentListState,
      pageIndex,
      pageSize,
    });
  };

  /**
   * Update table state - sort and page
   */
  sortChange = ({ active, direction }: Sort): void => {
    const currentListState = this.listStateSubj.value;
    this.listStateSubj.next({
      ...currentListState,
      pageIndex: 0,
      sortField: active as keyof Employee,
      sortDirection: direction,
    });
  };

  private getEmployees({ pageIndex, pageSize, sortField, sortDirection }: EmployeeListState): Observable<EmployeeListResult> {
    this.isLoadingSubj.next(true);
    return this.employeeApiService
      .getEmployees(pageIndex, pageSize, sortField, sortDirection)
      .pipe(
        catchError(() => of({
          data: [],
          totalSize: 0,
        })),
        finalize(() => {
          this.isLoadingSubj.next(false);
        }),
      );
  }
}
