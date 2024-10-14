import { Component } from '@angular/core';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [AdminNavComponent,AdminDashboardComponent],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css'
})
export class AdminMainComponent {

}
