import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightProfileComponent } from './right-profile.component';

describe('RightProfileComponent', () => {
  let component: RightProfileComponent;
  let fixture: ComponentFixture<RightProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RightProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
