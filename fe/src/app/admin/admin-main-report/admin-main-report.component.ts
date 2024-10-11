import { Component } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { AdminReportComponent } from "../admin-report/admin-report.component";

@Component({
  selector: 'app-admin-main-report',
  standalone: true,
  imports: [AdminNavComponent, AdminReportComponent],
  templateUrl: './admin-main-report.component.html',
  styleUrl: './admin-main-report.component.css'
})
export class AdminMainReportComponent {

}
