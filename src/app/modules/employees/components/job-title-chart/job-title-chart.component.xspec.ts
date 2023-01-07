import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobTitleChartComponent } from './job-title-chart.component';

// EXCLUDED FROM RUNNING BECAUSE OF PROBLEMS WITH jest + ngx-charts

describe('JobTitleChartComponent', () => {
  let component: JobTitleChartComponent;
  let fixture: ComponentFixture<JobTitleChartComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [
        JobTitleChartComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
