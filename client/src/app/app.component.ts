import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { HeaderDefaultComponent } from "./header-default/header-default.component";
import { HeaderAdminComponent } from "./admin/header-admin/header-admin.component";
import { AuthService } from './service/auth.service';
import { filter } from 'rxjs';
import { EventService } from './service/event.service';
import { TranslateService } from '@ngx-translate/core';
import { PeerService } from './service/peer.service';
import moment from 'moment';

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

  userPeerId: string | null = null;
  remotePeerId: string = '';
  isIncomingCall = false;
  incomingPeerId: string = '';
  incomingCall: any = null;
  isCameraOn = true;
  isMicOn = true;
  isCalling = false;

  incomingUserName: string = '';
  incomingUserImage: string = '';

  userInfo: any;
  display_name: string = '';
  profile_photo: string = '';

  statusCamera: boolean = true;
  statusMicro: boolean = true;

  ringtone: HTMLAudioElement | null = null;

  callTimer: any;
  callDuration: number = 0;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private eventService: EventService,
    private authService: AuthService,
    private translate: TranslateService,
    private peerService: PeerService
  ) { }

  timeout: any;

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



        this.authService.getUser(0).subscribe(
          (user) => {
            this.display_name = user.data.profile.display_name;
            this.profile_photo = user.data.profile.profile_photo;
          });

        this.peerService.userPeerId$.subscribe(id => {
          this.userPeerId = id
        });

        this.peerService.peer.on('call', (call: any) => {
          this.isIncomingCall = true;
          this.incomingPeerId = call.peer;
          this.incomingCall = call;

          const sound = localStorage.getItem('sound') || null;
          if (sound) {
            this.ringtone = new Audio(`assets/sounds/${sound}.mp3`);
            this.ringtone.loop = true;
            this.ringtone.play().catch((error: any) => {
              console.error('Không thể phát nhạc chuông:', error);
            });
          }

          this.timeout = setTimeout(() => {
            if (this.isIncomingCall) {
              this.rejectCall()
            }
          }, 15000);

          call.on('stream', (remoteStream: any) => this.startCallTimer());
          call.on('close', () => this.stopCallTimer());
        });

        this.peerService.userInfomation$.subscribe((user) => {
          this.userInfo = user;

          this.timeout = setTimeout(() => {
            if (!this.userInfo) {
              this.hangup();
            }
          }, 15000);

          this.incomingUserName = user?.userName;
          this.incomingUserImage = user?.userImage;
        });

        this.peerService.statusCamera$.subscribe((status) => this.statusCamera = status);
        this.peerService.statusMicro$.subscribe((status) => this.statusMicro = status);
        this.peerService.statusCalling$.subscribe((status) => this.isCalling = status);
        this.peerService.timeOut$.subscribe((value) => this.callDuration = value);

      }
      else this.isLoggedIn = false;
    });
  }


  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    this.peerService.localStream$.subscribe(stream => {
      if (this.localVideo.nativeElement) {
        this.localVideo.nativeElement.srcObject = stream;
      }
    });

    this.peerService.remoteStream$.subscribe(stream => {
      if (this.remoteVideo.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = stream;
      }
    });
  }

  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;
    this.peerService.toggleCamera(this.isCameraOn);
  }

  toggleMicrophone() {
    this.isMicOn = !this.isMicOn;
    this.peerService.toggleMicrophone(this.isMicOn);
  }

  private clearCallTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private startCallTimer() {
    this.callDuration = 0;
    this.stopCallTimer();
    this.callTimer = setInterval(() => {
      this.callDuration++;
      this.peerService.sendSignal('TIME_OUT', this.callDuration);
    }, 1000);
  }

  private stopCallTimer() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }

  hangup() {
    if (this.ringtone) {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
      this.ringtone = null;
    }

    this.isCameraOn = true;
    this.isMicOn = true;
    this.isCalling = false;
    this.peerService.endCall();
    this.stopCallTimer();
    this.clearCallTimeout();
  }

  acceptCall() {
    if (this.ringtone) {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
      this.ringtone = null;
    }

    this.clearCallTimeout();
    this.isCalling = true;
    this.statusCamera = true;
    this.statusMicro = true;
    this.isIncomingCall = false;
    if (this.incomingCall) {
      this.peerService.acceptCall(this.incomingCall);

      const connection = this.peerService.peer.connect(this.incomingPeerId);
      connection.on('open', () => this.peerService.setupDataConnection(connection));
    }
  }

  rejectCall() {
    if (this.ringtone) {
      this.ringtone.pause();
      this.ringtone.currentTime = 0;
      this.ringtone = null;
    }

    this.isCameraOn = true;
    this.isMicOn = true;
    this.isIncomingCall = false;
    if (this.incomingCall) this.peerService.rejectCall(this.incomingCall);
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:scroll')
  @HostListener('window:click')
  handleUserActivity() {
    if (this.isLoggedIn) this.eventService.resetIdleTimer();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isLoggedIn) {
      navigator.sendBeacon('http://localhost:8000/api/update-online-status',
        JSON.stringify({ 'user_id': this.user?.id, 'online_status': 'offline' }));
    }

    if (this.peerService.isCallActive()) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }

  convertToMinutes(seconds: number): string {
    return moment.utc(seconds * 1000).format("mm:ss");
  }

}
