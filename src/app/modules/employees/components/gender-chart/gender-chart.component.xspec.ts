import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenderChartComponent } from './gender-chart.component';

// EXCLUDED FROM RUNNING BECAUSE OF PROBLEMS WITH jest + ngx-charts

describe('GenderChartComponent', () => {
  let component: GenderChartComponent;
  let fixture: ComponentFixture<GenderChartComponent>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [
        GenderChartComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
