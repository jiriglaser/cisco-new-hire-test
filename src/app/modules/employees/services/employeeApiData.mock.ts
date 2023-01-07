import { Employee } from '../models/employee.model';

export const employeeApiDataMock = [
  {
    name: 'Mike Potts',
    jobTitle: 'CEO',
    tenure: '5',
    gender: 'Male',
  },
  {
    name: 'Tom Connor',
    jobTitle: 'Developer',
    tenure: '2',
    gender: 'Male',
  },
  {
    name: 'Jesse Karl',
    jobTitle: 'Developer',
    tenure: '3',
    gender: 'Male',
  },
];

export const employeeApiDataMockParsedSortedNameAsc: Employee[] = [
  {
    name: 'Jesse Karl',
    jobTitle: 'Developer',
    tenure: 3,
    gender: 'Male',
  },
  {
    name: 'Mike Potts',
    jobTitle: 'CEO',
    tenure: 5,
    gender: 'Male',
  },
  {
    name: 'Tom Connor',
    jobTitle: 'Developer',
    tenure: 2,
    gender: 'Male',
  },
];

export const employeeApiDataMockParsedSortedTenureDesc: Employee[] = [
  {
    name: 'Mike Potts',
    jobTitle: 'CEO',
    tenure: 5,
    gender: 'Male',
  },
  {
    name: 'Jesse Karl',
    jobTitle: 'Developer',
    tenure: 3,
    gender: 'Male',
  },
  {
    name: 'Tom Connor',
    jobTitle: 'Developer',
    tenure: 2,
    gender: 'Male',
  },
];
