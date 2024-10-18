import { Component } from '@angular/core';
import { AdminNavComponent } from "../admin-nav/admin-nav.component";
import { AdminUserComponent } from "../admin-user/admin-user.component";

@Component({
  selector: 'app-admin-main-user',
  standalone: true,
  imports: [AdminNavComponent, AdminUserComponent],
  templateUrl: './admin-main-user.component.html',
  styleUrl: './admin-main-user.component.css'
})
export class AdminMainUserComponent {

}
