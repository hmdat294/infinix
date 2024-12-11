import { Component, ElementRef } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NavComponent,CommonModule,RouterModule,FormsModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
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
        // Gán mảng `data` từ response vào `listUser`
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

  shopid: number = 0;
  setshowdebiet(id: number) {
    this.shopid = id;
  }
}
