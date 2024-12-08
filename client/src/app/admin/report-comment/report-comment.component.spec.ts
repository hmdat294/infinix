import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCommentComponent } from './report-comment.component';

describe('ReportCommentComponent', () => {
  let component: ReportCommentComponent;
  let fixture: ComponentFixture<ReportCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
