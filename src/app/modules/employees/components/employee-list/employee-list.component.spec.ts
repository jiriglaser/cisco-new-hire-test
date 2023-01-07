import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render, screen, within } from '@testing-library/angular';
import { of } from 'rxjs';

import { EmployeeApiService } from '../../services/employeeApi.service';
import {
  employeeApiDataMockParsedSortedNameAsc as mockDataSortedNameAsc,
} from '../../services/employeeApiData.mock';
import { EmployeeListComponent } from './employee-list.component';

async function renderComponent() {
  return render(EmployeeListComponent, {
    imports: [
      NoopAnimationsModule,
      MatPaginatorModule,
      MatProgressSpinnerModule,
      MatSortModule,
      MatTableModule,
    ],
    providers: [
      {
        provide: EmployeeApiService,
        useValue: {
          getEmployees: jest.fn().mockReturnValue(
            of({ data: mockDataSortedNameAsc, totalSize: 3 }),
          ),
        },
      },
    ],
  });
}

test('EmployeeListComponent', async () => {
  await renderComponent();
  expect(
    (await screen.findAllByRole('row')).length,
  ).toBe(4); // table header row included
  expect(
    await screen.findByRole('row', { name: /Jesse Karl Developer 3 Male/i }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('row', { name: /Mike Potts CEO 5 Male/i }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole('row', { name: /Tom Connor Developer 2 Male/i }),
  ).toBeInTheDocument();
  const paginator = await screen.findByRole('group', { name: /select page/i });
  expect(
    await within(paginator).findByText(/1 . 3 of 3/i),
  ).toBeInTheDocument();
});
