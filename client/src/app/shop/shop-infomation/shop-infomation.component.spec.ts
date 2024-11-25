import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInfomationComponent } from './shop-infomation.component';

describe('ShopInfomationComponent', () => {
  let component: ShopInfomationComponent;
  let fixture: ComponentFixture<ShopInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopInfomationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShopInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
