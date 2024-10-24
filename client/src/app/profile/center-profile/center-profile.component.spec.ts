import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterProfileComponent } from './center-profile.component';

describe('CenterProfileComponent', () => {
  let component: CenterProfileComponent;
  let fixture: ComponentFixture<CenterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
