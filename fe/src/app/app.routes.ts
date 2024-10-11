import { Routes } from '@angular/router';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';


export const routes: Routes = [
    {path: '', component: MainHomeComponent},
    {path: 'profile', component: MainProfileComponent}
];
