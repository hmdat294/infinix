import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainUserComponent } from './admin-main-user.component';

describe('AdminMainUserComponent', () => {
  let component: AdminMainUserComponent;
  let fixture: ComponentFixture<AdminMainUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMainUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMainUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
