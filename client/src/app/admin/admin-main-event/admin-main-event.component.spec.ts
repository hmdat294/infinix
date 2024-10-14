import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainEventComponent } from './admin-main-event.component';

describe('AdminMainEventComponent', () => {
  let component: AdminMainEventComponent;
  let fixture: ComponentFixture<AdminMainEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMainEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMainEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
