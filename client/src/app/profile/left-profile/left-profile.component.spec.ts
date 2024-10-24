import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftProfileComponent } from './left-profile.component';

describe('LeftProfileComponent', () => {
  let component: LeftProfileComponent;
  let fixture: ComponentFixture<LeftProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeftProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
