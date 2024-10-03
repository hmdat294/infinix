import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftHomeComponent } from './left-home.component';

describe('LeftHomeComponent', () => {
  let component: LeftHomeComponent;
  let fixture: ComponentFixture<LeftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
