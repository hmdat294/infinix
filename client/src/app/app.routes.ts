import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';
import { AdminMainComponent } from './admin/admin-main/admin-main.component';
import { AdminMainUserComponent } from './admin/admin-main-user/admin-main-user.component';
import { AdminMainReportComponent } from './admin/admin-main-report/admin-main-report.component';
import { AdminMainEventComponent } from './admin/admin-main-event/admin-main-event.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminMainContentComponent } from './admin/admin-main-content/admin-main-content.component';

export const routes: Routes = [
    { path: '', component: MainHomeComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: MainProfileComponent, canActivate: [AuthGuard] },
    { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'email/verify/:id/:hash', component: VerifyEmailComponent },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    {path: 'admin', component: AdminMainComponent},
    {path: 'admin/user', component: AdminMainUserComponent},
    {path: 'admin/report', component: AdminMainReportComponent},
    {path: 'admin/event', component: AdminMainEventComponent},
    {path: 'admin/content', component: AdminMainContentComponent},
];
