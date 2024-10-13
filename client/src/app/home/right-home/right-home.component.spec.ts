import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightHomeComponent } from './right-home.component';

describe('RightHomeComponent', () => {
  let component: RightHomeComponent;
  let fixture: ComponentFixture<RightHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RightHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
