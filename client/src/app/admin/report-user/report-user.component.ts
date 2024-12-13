import { Component, ElementRef } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-report-user',
    imports: [NavComponent, CommonModule, RouterModule, FormsModule],
    templateUrl: './report-user.component.html',
    styleUrl: './report-user.component.css'
})
export class ReportUserComponent {
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
        this.listReport = response.data.filter((item: any) => item.type === 'user');
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
