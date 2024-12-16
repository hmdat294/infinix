import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderDefaultComponent } from "./header-default/header-default.component";
import { HeaderAdminComponent } from "./admin/header-admin/header-admin.component";
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs';
import { EventService } from './service/event.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule, HeaderDefaultComponent, HeaderAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  is_route_admin: boolean = false;
  user: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private eventService: EventService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.renderer.setAttribute(document.documentElement, 'data-theme', localStorage.getItem('theme') || '');
    this.translate.setDefaultLang(localStorage.getItem('language') || 'vi');

    this.authService.token$.subscribe(auth_token => {

      if (!!auth_token) {
        this.authService.getUser(0).subscribe(
          (response) => {
            this.isLoggedIn = this.authService.checkPermissions('can_login', response.data.permissions);
            if (this.isLoggedIn) this.user = response.data;
          });

        this.router.events.pipe(
          filter((event: any) => event instanceof NavigationEnd)
        ).subscribe(
          (event: any) =>
            this.is_route_admin = !!(event.urlAfterRedirects.split('/')[1] == 'admin')
        );
      }
    });

  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:scroll')
  @HostListener('window:click')
  handleUserActivity() {
    if (this.isLoggedIn) {
      this.eventService.resetIdleTimer();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isLoggedIn) {
      navigator.sendBeacon('http://localhost:8000/api/update-online-status',
        JSON.stringify({ 'user_id': this.user?.id, 'online_status': 'offline' }));
    }
  }

}
