import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainReportComponent } from './admin-main-report.component';

describe('AdminMainReportComponent', () => {
  let component: AdminMainReportComponent;
  let fixture: ComponentFixture<AdminMainReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMainReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
