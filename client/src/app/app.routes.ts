import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotificationComponent } from './notification/notification.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserComponent } from './admin/user/user.component';
import { ReportComponent } from './admin/report/report.component';
import { EventComponent } from './admin/event/event.component';
import { PostComponent } from './admin/post/post.component';

export const routes: Routes = [
    { path: '', component: MainHomeComponent, canActivate: [AuthGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: MainProfileComponent, canActivate: [AuthGuard] },
    { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthGuard] },
    { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },

    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'email/verify/:id/:hash', component: VerifyEmailComponent },

    { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'admin/user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'admin/report', component: ReportComponent, canActivate: [AuthGuard] },
    { path: 'admin/event', component: EventComponent, canActivate: [AuthGuard] },
    { path: 'admin/post', component: PostComponent, canActivate: [AuthGuard] },

];
