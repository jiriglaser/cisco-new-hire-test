import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';

import { Employee } from '../../models/employee.model';
import { EmployeeApiService } from '../../services/employeeApi.service';
import { AddEmployeeComponent } from './add-employee.component';

async function renderComponent() {
  return render(AddEmployeeComponent, {
    imports: [
      NoopAnimationsModule,
      ReactiveFormsModule,
      MatToolbarModule,
      MatCardModule,
      MatInputModule,
      MatSelectModule,
    ],
    providers: [
      FormBuilder,
      Router,
      {
        provide: MatSnackBar,
        useValue: {
          open: jest.fn(),
        },
      },
      {
        provide: EmployeeApiService,
        useValue: {
          addEmployee: jest.fn().mockReturnValue(of(true)),
        },
      },
    ],
  });
}

test('AddEmployeeComponent: form elements exist', async () => {
  await renderComponent();

  expect(
    screen.getByPlaceholderText(/name/i),
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/job title/i),
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/tenure/i),
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText(/gender/i),
  ).toBeInTheDocument();

  const cancelBtn = screen.getByRole('link', { name: /cancel/i });
  expect(cancelBtn).toBeInTheDocument();
  expect(cancelBtn).toHaveAttribute('routerLink', '..');

  const addBtn = screen.getByRole('button', { name: /add/i });
  expect(addBtn).toBeInTheDocument();
  expect(addBtn).toBeDisabled();
});

test('AddEmployeeComponent: error messages with invalid inputs', async () => {
  const { debugElement } = await renderComponent();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const componentElement = debugElement.nativeElement;

  const nameInp = screen.getByPlaceholderText(/name/i);
  const jobTitleInp = screen.getByPlaceholderText(/job title/i);
  const tenureInp = screen.getByPlaceholderText(/tenure/i);
  const genderSel = screen.getByRole('combobox', { name: /gender/i });
  const addBtn = screen.getByRole('button', { name: /add/i });

  await userEvent.click(nameInp);
  await userEvent.click(jobTitleInp);
  await userEvent.click(tenureInp);
  await userEvent.click(genderSel);
  await userEvent.click(nameInp);

  expect(componentElement).toHaveTextContent(/name is required/i);
  expect(componentElement).toHaveTextContent(/job title is required/i);
  expect(componentElement).toHaveTextContent(/tenure is required/i);
  // could not make this work with MatSelect: expect(componentElement).toHaveTextContent(/gender is required/i);
  expect(addBtn).toBeDisabled();
});

test('AddEmployeeComponent: add user', async () => {
  const employeeToBeAdded: Employee = {
    name: 'Anna Johnson',
    jobTitle: 'CTO',
    tenure: 15,
    gender: 'Female',
  };

  const { debugElement } = await renderComponent();
  const employeeApiServiceSpy = debugElement.injector.get(EmployeeApiService);
  const router = debugElement.injector.get(Router);
  router.navigate = jest.fn();

  const nameInp = screen.getByPlaceholderText(/name/i);
  const jobTitleInp = screen.getByPlaceholderText(/job title/i);
  const tenureInp = screen.getByPlaceholderText(/tenure/i);
  const genderSel = screen.getByPlaceholderText(/gender/i);
  const addBtn = screen.getByRole('button', { name: /add/i });

  await userEvent.type(nameInp, employeeToBeAdded.name);
  await userEvent.type(jobTitleInp, employeeToBeAdded.jobTitle);
  await userEvent.type(tenureInp, employeeToBeAdded.tenure.toString(10));
  await userEvent.click(genderSel);
  await userEvent.click(screen.getByText(employeeToBeAdded.gender));

  expect(addBtn).toBeEnabled();
  await userEvent.click(addBtn);

  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(employeeApiServiceSpy.addEmployee).toHaveBeenCalledWith<[Employee]>(employeeToBeAdded);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  expect(router.navigate).toHaveBeenCalledWith(['..']);
});
