import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterHomeComponent } from './center-home.component';

describe('CenterHomeComponent', () => {
  let component: CenterHomeComponent;
  let fixture: ComponentFixture<CenterHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CenterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
