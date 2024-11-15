import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotificationComponent } from './notification/notification.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserComponent } from './admin/user/user.component';
import { SettingComponent } from './setting/setting.component';
import { SearchComponent } from './search/search.component';
import { FriendProfileComponent } from './friend-profile/friend-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { ReportComponent } from './admin/report/report.component';
import { ReportpostComponent } from './admin/report-post/report-post.component';
import { EventComponent } from './admin/event/event.component';

export const routes: Routes = [
    { path: '', component: MainHomeComponent, canActivate: [AuthGuard] },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: MainProfileComponent, canActivate: [AuthGuard] },
    { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthGuard] },
    { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
    { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
    { path: 'search/:keyword', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'friend-profile/:user_id', component: FriendProfileComponent, canActivate: [AuthGuard] },
    { path: 'friend-profile/:user_id/:post_id', component: FriendProfileComponent, canActivate: [AuthGuard] },
    { path: 'bookmark', component: BookmarkComponent, canActivate: [AuthGuard] },

    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard] },

    { path: 'admin', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'admin/user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'admin/report', component: ReportComponent, canActivate: [AuthGuard] },
    { path: 'admin/report-post', component: ReportpostComponent, canActivate: [AuthGuard] },
    { path: 'admin/event', component: EventComponent, canActivate: [AuthGuard] },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];
