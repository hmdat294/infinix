import { Component } from '@angular/core';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { AdminEventComponent } from "../admin-event/admin-event.component";

@Component({
  selector: 'app-admin-main-event',
  standalone: true,
  imports: [AdminNavComponent, AdminEventComponent],
  templateUrl: './admin-main-event.component.html',
  styleUrl: './admin-main-event.component.css'
})
export class AdminMainEventComponent {

}
