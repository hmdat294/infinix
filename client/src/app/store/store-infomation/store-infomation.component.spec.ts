import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInfomationComponent } from './store-infomation.component';

describe('StoreInfomationComponent', () => {
  let component: StoreInfomationComponent;
  let fixture: ComponentFixture<StoreInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreInfomationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
