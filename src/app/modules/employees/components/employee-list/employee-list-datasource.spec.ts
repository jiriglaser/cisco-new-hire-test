import { PageEvent } from '@angular/material/paginator';
import { createMockWithValues, Mock } from '@testing-library/angular/jest-utils';
import { of } from 'rxjs';

import { EmployeeListResult } from '../../models/employee-list-result.model';
import { EmployeeListState } from '../../models/employee-list-state.model';
import { EmployeeApiService } from '../../services/employeeApi.service';
import {
  employeeApiDataMockParsedSortedNameAsc as mockDataSortedNameAsc,
} from '../../services/employeeApiData.mock';
import { EmployeeListDataSource } from './employee-list-datasource';

function getMockEmployeeApiService(): Mock<EmployeeApiService> {
  return createMockWithValues(EmployeeApiService, {
    getEmployees: jest.fn(() => of({
      data: mockDataSortedNameAsc.slice(0, 2),
      totalSize: 3,
    })),
  });
}

describe('EmployeeListDataSource', () => {
  const initialListState: EmployeeListState = {
    pageIndex: 0,
    pageSize: 2,
    sortField: 'name',
    sortDirection: 'asc',
  };

  let employeeApiServiceMock: Mock<EmployeeApiService>;

  let employeeListDataSource: EmployeeListDataSource;

  beforeEach(() => {
    employeeApiServiceMock = getMockEmployeeApiService();
    employeeListDataSource = new EmployeeListDataSource(
      employeeApiServiceMock,
      initialListState,
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // eslint-disable-next-line jest/expect-expect
  test('get initial data source state', () => {
    let listState: EmployeeListState | undefined = undefined;
    let listData: EmployeeListResult | undefined = undefined;
    employeeListDataSource.state$.subscribe((state) => listState = state);
    employeeListDataSource.data$.subscribe((data) => listData = data);
    jest.runOnlyPendingTimers();
    expect(listState).toEqual(initialListState);
    expect(listData).toEqual({
      data: mockDataSortedNameAsc.slice(0, 2),
      totalSize: 3,
    });
  });

  test('Change page', () => {
    employeeListDataSource.data$.subscribe();
    employeeListDataSource.pageChange(
      createMockWithValues(PageEvent, { pageIndex: 1, pageSize: 10 }),
    );
    jest.runOnlyPendingTimers();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(employeeApiServiceMock.getEmployees).toHaveBeenCalledWith(
      1, 10, initialListState.sortField, initialListState.sortDirection,
    );
  });

  test('Change sorting', () => {
    employeeListDataSource.data$.subscribe();
    employeeListDataSource.sortChange({ active: 'tenure', direction: 'desc' });
    jest.runOnlyPendingTimers();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(employeeApiServiceMock.getEmployees).toHaveBeenCalledWith(
      0, initialListState.pageSize, 'tenure', 'desc',
    );
  });
});

