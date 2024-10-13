import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MainHomeComponent } from './home/main-home/main-home.component';
import { MainProfileComponent } from './profile/main-profile/main-profile.component';

export const routes: Routes = [
    { path: '', component: MainHomeComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: MainProfileComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'email/verify/:id/:hash', component: VerifyEmailComponent },
    { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
];
