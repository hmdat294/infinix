import { Component, ElementRef, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';

@Component({
    selector: 'app-event',
    imports: [NavComponent, CommonModule],
    templateUrl: './event.component.html',
    styleUrl: './event.component.css'
})

export class EventComponent implements OnInit {
  listUser: any;
  tabAccordion: string = '';
  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef,
  ) { }
  
  ngOnInit(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        // Gán mảng `data` từ response vào `listUser`
        this.listUser = response.data;
        console.log(this.listUser);
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
