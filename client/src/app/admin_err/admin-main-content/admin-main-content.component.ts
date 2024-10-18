import { Component } from '@angular/core';
import { AdminContentComponent } from '../admin-content/admin-content.component';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-admin-main-content',
  standalone: true,
  imports: [AdminContentComponent,AdminNavComponent],
  templateUrl: './admin-main-content.component.html',
  styleUrl: './admin-main-content.component.css'
})
export class AdminMainContentComponent {

}
