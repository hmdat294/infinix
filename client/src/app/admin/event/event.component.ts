import { Component, ElementRef, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../service/admin.service';
import { SettingService } from '../../service/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [NavComponent, CommonModule, RouterModule, FormsModule, NgxPaginationModule],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  listUser: any[] = [];
  tabAccordion: string = '';
  reportService: any;
  listReport: any[] = [];
  filteredReports: any[] = []; 
  filterStatus: string = 'all'; 
  currentPage = 1;
  shopid: number = 0;

  constructor(
    private adminService: AdminService,
    private settingService: SettingService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchReports();
  }

  fetchUsers(): void {
    this.adminService.getUser().subscribe(
      (response) => {
        if (response?.data) {
          this.listUser = response.data;
          console.log('Users fetched:', this.listUser);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchReports(): void {
    // Giả định có một API trả về danh sách report
    this.adminService.getReports().subscribe(
      (response) => {
        if (response?.data) {
          this.listReport = response.data;
          this.filteredReports = [...this.listReport];
        }
      },
      (error) => {
        console.error('Error fetching reports:', error);
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

  toggleDetails(index: number, event: Event): void {
    event.preventDefault();
    if (this.filteredReports[index]) {
      this.filteredReports[index].isExpanded = !this.filteredReports[index].isExpanded;
    }
  }

  updateStatus(item: any): void {
    this.adminService.updateReportStatus(item.id, item.status).subscribe(
      (response) => {
        if (response?.updatedStatus) {
          item.status = response.updatedStatus;
          this.filterReports();
        }
      },
      (error) => {
        console.error('Error updating status:', error);
      }
    );
  }

  filterReports(): void {
    if (this.filterStatus === 'all') {
      this.filteredReports = [...this.listReport];
    } else {
      this.filteredReports = this.listReport.filter(
        (report) => report.status === this.filterStatus
      );
    }
  }

  setshowdebiet(id: number): void {
    this.shopid = id;
  }

  
}
