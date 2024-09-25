import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
    {path:'', component: ChatComponent, canActivate: [AuthGuard]},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent}
];
