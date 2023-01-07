/* eslint-disable jest/expect-expect */
import { HttpClient } from '@angular/common/http';
import { createMockWithValues, Mock } from '@testing-library/angular/jest-utils';
import { Context, marbles } from 'rxjs-marbles/jest';

import { Employee } from '../models/employee.model';
import { EmployeeApiService, mockHttpDelay } from './employeeApi.service';
import {
  employeeApiDataMock as mockData,
  employeeApiDataMockParsedSortedNameAsc as mockDataSortedNameAsc,
  employeeApiDataMockParsedSortedTenureDesc as mockDataSortedTenureDesc,
} from './employeeApiData.mock';

// eslint-disable-next-line jsdoc/require-jsdoc
function getMockHttpClient(m: Context): Mock<HttpClient> {
  return createMockWithValues(HttpClient, {
    get: jest.fn().mockReturnValue(m.cold('-a|', { a: mockData })),
  });
}

describe('EmployeeApiService', () => {
  let employeeApiService: EmployeeApiService;

  beforeEach(marbles((m) => {
    employeeApiService = new EmployeeApiService(getMockHttpClient(m));
  }));

  test('get employees sorted by name', marbles((m) => {
    // cold observable defined by '750ms (b|)'
    const expected = m.cold(`${mockHttpDelay}ms (b|)`, { b: {
      data: mockDataSortedNameAsc,
      totalSize: mockDataSortedNameAsc.length,
    } });
    m.expect(
      employeeApiService.getEmployees(0, 10, 'name', 'asc'),
    ).toBeObservable(expected);
  }));

  test('get employees sorted by tenure, page 2', marbles((m) => {
    const expected = m.cold(`${mockHttpDelay}ms (b|)`, { b: {
      data: [mockDataSortedTenureDesc[2]],
      totalSize: mockDataSortedTenureDesc.length,
    } });
    m.expect(
      employeeApiService.getEmployees(1, 2, 'name', 'asc'),
    ).toBeObservable(expected);
  }));

  test('get employee job title stats', marbles((m) => {
    const expected = m.cold('(s|)', { s: [
      { name: 'CEO', value: 1 },
      { name: 'Developer', value: 2 },
    ] });
    m.expect(
      employeeApiService.getEmployeeStats('jobTitle'),
    ).toBeObservable(expected);
  }));

  test('add employee', marbles((m) => {
    const newUser: Employee = { name: 'Adam Black', jobTitle: 'QA', tenure: 15, gender: 'Male' };
    const expectedAddEmployee = m.cold('(c|)', { c: true });
    const expectedGetEmployees = m.cold(`${mockHttpDelay}ms (d|)`, { d: {
      data: [ newUser, ...mockDataSortedNameAsc ],
      totalSize: mockDataSortedNameAsc.length + 1,
    } });
    m.expect(
      employeeApiService.addEmployee(newUser),
    ).toBeObservable(expectedAddEmployee);
    m.expect(
      employeeApiService.getEmployees(0, 10, 'name', 'asc'),
    ).toBeObservable(expectedGetEmployees);
  }));
});

