import { Component, ElementRef } from '@angular/core';
import { NavComponent } from "../nav/nav.component";
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [NavComponent,CommonModule,RouterModule,FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  tabAccordion: string = '';
  reportService:any;
  listReport: any;
  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,) { }
  ngOnInit(): void {
    this.adminService.getReports().subscribe(
      (response) => {
        this.listReport = response.data;
        console.log(this.listReport);
      },
      (error) => {
        console.error('Lỗi khi gọi API:', error);
      }
    );
    
  }
  tabChild(tab: string) {
    this.tabAccordion = this.settingService.tabChild(this.tabAccordion, tab, this.el);
  }
  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  
}
