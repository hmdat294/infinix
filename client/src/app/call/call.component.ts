import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PeerService } from '../service/peer.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-call',
  imports: [FormsModule, CommonModule],
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent implements OnInit {

  ngOnInit(): void {
    
  }

  // userPeerId: string | null = null;
  // remotePeerId: string = '';
  // isIncomingCall = false;
  // incomingPeerId: string = '';
  // incomingCall: any = null;
  // isCameraOn = true;
  // isMicOn = true;
  // isCalling = false;

  // incomingUserName: string = '';
  // incomingUserImage: string = '';

  // display_name: string = '';
  // profile_photo: string = '';

  // statusCamera:boolean = true;
  // statusMicro:boolean = true;

  // constructor(private peerService: PeerService, private authService: AuthService) { }

  // ngOnInit(): void {

  //   this.authService.getUser(0).subscribe(
  //     (user) => {
  //       this.display_name = user.data.profile.display_name;
  //       this.profile_photo = user.data.profile.profile_photo;
  //     });

  //   this.peerService.userPeerId$.subscribe(id => {
  //     this.userPeerId = id;
  //   });

  //   console.log(this.peerService.peer);


  //   this.peerService.peer.on('call', (call: any) => {
  //     this.isIncomingCall = true;
  //     this.incomingPeerId = call.peer;

  //     // Lưu cuộc gọi
  //     this.incomingCall = call;
  //   });

  //   this.peerService.userInfomation$.subscribe((user) => {
  //     this.incomingUserName = user.userName;
  //     this.incomingUserImage = user.userImage;
  //   });
    
  //   this.peerService.statusCamera$.subscribe((status) => {
  //     console.log('Camera:', status);
  //     this.statusCamera = status;
  //   });
    
  //   this.peerService.statusMicro$.subscribe((status) => {
  //     console.log('Micro:', status);
  //     this.statusMicro = status;
  //   });

  // }

  // @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  // @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  // ngAfterViewInit(): void {
  //   this.peerService.localStream$.subscribe(stream => {
  //     if (this.localVideo.nativeElement) {
  //       this.localVideo.nativeElement.srcObject = stream;
  //     }
  //   });

  //   this.peerService.remoteStream$.subscribe(stream => {
  //     if (this.remoteVideo.nativeElement) {
  //       this.remoteVideo.nativeElement.srcObject = stream;
  //     }
  //   });
  // }

  // toggleCamera() {
  //   this.isCameraOn = !this.isCameraOn;
  //   this.peerService.toggleCamera(this.isCameraOn);
  // }

  // toggleMicrophone() {
  //   this.isMicOn = !this.isMicOn;
  //   this.peerService.toggleMicrophone(this.isMicOn);
  // }

  // async makeCall() {
  //   if (this.remotePeerId) {

  //     this.isCalling = true;
  //     const callOptions = {
  //       userName: 'MeoMeo',
  //       userImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStNmKUaE0fQ3lWHPhWXqMBNuX5rrBkyBhz4w&s',  // Hình ảnh người dùng
  //     };

  //     this.peerService.makeCall(this.remotePeerId, callOptions);
  //   }
  // }

  // hangup() {
  //   this.isCalling = false;
  //   this.peerService.endCall();
  // }

  // // Chấp nhận cuộc gọi
  // acceptCall() {
  //   this.isCalling = true;

  //   this.isIncomingCall = false;  // Ẩn giao diện cuộc gọi đến
  //   if (this.incomingCall) {
  //     this.peerService.acceptCall(this.incomingCall);

  //     // Thiết lập kết nối dữ liệu khi nhận cuộc gọi
  //     const connection = this.peerService.peer.connect(this.incomingPeerId);  // Tạo kết nối dữ liệu đến người gọi
  //     connection.on('open', () => {
  //       console.log('Kết nối dữ liệu đã mở.');
  //       this.peerService.setupDataConnection(connection);  // Lưu kết nối dữ liệu để gửi tín hiệu
  //     });
  //   }
  // }

  // rejectCall() {
  //   this.isIncomingCall = false;  // Ẩn giao diện cuộc gọi đến
  //   if (this.incomingCall) {
  //     // Đóng kết nối cuộc gọi
  //     this.peerService.rejectCall(this.incomingCall);
  //   }
  // }



  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //   if (this.peerService.isCallActive()) {
  //     $event.preventDefault();
  //     $event.returnValue = '';
  //   }
  // }
}

