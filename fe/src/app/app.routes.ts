import { Routes } from '@angular/router';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { AdminMainUserComponent } from './admin/admin-main-user/admin-main-user.component';
import { AdminMainReportComponent } from './admin/admin-main-report/admin-main-report.component';
import { AdminMainEventComponent } from './admin/admin-main-event/admin-main-event.component';


export const routes: Routes = [
    {path: '', component: MainHomeComponent},
    {path: 'profile', component: MainProfileComponent},
    {path: 'admin', component: AdminMainComponent},
    {path: 'admin/user', component: AdminMainUserComponent},
    {path: 'admin/report', component: AdminMainReportComponent},
    {path: 'admin/event', component: AdminMainEventComponent},
];
