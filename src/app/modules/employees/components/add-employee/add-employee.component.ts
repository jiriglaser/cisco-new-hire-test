import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Gender } from '../../models/gender.model';
import { EmployeeApiService } from '../../services/employeeApi.service';

@Component({
  selector: 'empl-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent {
  /* eslint-disable @typescript-eslint/unbound-method */
  employeeForm = this.fb.group({
    name: ['', Validators.required],
    jobTitle: ['', Validators.required],
    tenure: ['', Validators.compose([
      Validators.required,
      Validators.pattern(/^[0-9]{1,2}$/),
    ])],
    gender: ['', Validators.required],
  });
  /* eslint-enable @typescript-eslint/unbound-method */

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notificationService: MatSnackBar,
    private employeeApiService: EmployeeApiService,
  ) {}

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.employeeApiService
        .addEmployee({
          name: this.employeeForm.controls.name.value as string,
          jobTitle: this.employeeForm.controls.jobTitle.value as string,
          tenure: Number(this.employeeForm.controls.tenure.value),
          gender: this.employeeForm.controls.gender.value as Gender,
        })
        .subscribe((success) => {
          if (success) {
            this.notificationService.open('Employee added successfully', undefined, { duration: 3000 });
            void this.router.navigate(['..']);
          } else {
            this.notificationService.open('Error while adding the employee', undefined, { duration: 5000 });
          }
        });
    }
  }
}
