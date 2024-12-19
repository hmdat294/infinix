import { Injectable } from '@angular/core';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  public peer: Peer;
  private currentCall: MediaConnection | null = null;
  public currentDataConnection: DataConnection | null = null;

  public userPeerId$ = new BehaviorSubject<string | null>(null);
  public localStream$ = new BehaviorSubject<MediaStream | null>(null);
  public remoteStream$ = new BehaviorSubject<MediaStream | null>(null);
  private userInfomation = new BehaviorSubject<any>('Default Value');
  userInfomation$ = this.userInfomation.asObservable();

  updateInfo(newValue: any) {
    this.userInfomation.next(newValue);
  }

  constructor(private authService: AuthService) {
    this.peer = new Peer('infinix-user-' + Math.floor(Math.random() * 1000));

    // this.authService.getUser(0).subscribe(
    //   (user) => {
    //     this.peer = new Peer('infinix-user-' + user.data.id);
    //   });

    this.peer.on('open', id => {
      this.userPeerId$.next(id);
    });

    this.peer.on('call', async (call: MediaConnection) => {
      console.log('Cuộc gọi đến từ:', call.peer);

      // Chờ người dùng chấp nhận cuộc gọi
      this.remoteStream$.next(null);
    });

    // Lắng nghe yêu cầu kết nối dữ liệu
    this.peer.on('connection', (connection: DataConnection) => {
      this.setupDataConnection(connection); // Thiết lập kết nối dữ liệu
    });
  }

  // Thiết lập kết nối dữ liệu
  public setupDataConnection(connection: DataConnection) {
    this.currentDataConnection = connection;

    // Xử lý tín hiệu nhận được
    connection.on('data', (message: any) => {
      this.handleIncomingMessage(message);
    });

    // Xử lý ngắt kết nối
    connection.on('close', () => {
      console.log('Kết nối đã bị ngắt.');
      this.currentDataConnection = null;
    });
  }

  public handleIncomingMessage(message: any) {
    switch (message.type) {
      case 'TOGGLE_CAMERA':
        console.log('Đối phương đã tắt/mở camera:', message.value);
        break;
      case 'TOGGLE_MIC':
        console.log('Đối phương đã tắt/mở mic:', message.value);
        break;
      case 'END_CALL':
        console.log('Đối phương đã kết thúc cuộc gọi.');
        this.endCall();
        break;
      case 'NOTIFICATION':
        console.log('Thông báo từ đối phương:', message.value);
        break;
      default:
        this.updateInfo(message);
    }
  }

  // Gửi tín hiệu đến đối phương
  sendSignal(type: string, value: any = null) {
    if (this.currentDataConnection) {
      this.currentDataConnection.send({ type, value });
    }
  }

  sendCallRejectedNotification() {
    if (this.currentDataConnection) {
      this.sendSignal('CALL_REJECTED');
      console.log('Đã gửi tín hiệu từ chối cuộc gọi');
    }
  }


  toggleCamera(enabled: boolean) {
    const localStream = this.localStream$.value;
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
        this.sendSignal('TOGGLE_CAMERA', enabled); // Gửi tín hiệu camera
      }
    }
  }

  toggleMicrophone(enabled: boolean) {
    const localStream = this.localStream$.value;
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
        this.sendSignal('TOGGLE_MIC', enabled); // Gửi tín hiệu micro
      }
    }
  }

  endCall() {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }
    if (this.currentDataConnection) {
      this.sendSignal('END_CALL'); // Gửi tín hiệu kết thúc cuộc gọi
      this.currentDataConnection.close();
      this.currentDataConnection = null;
    }
    this.stopLocalStream();
    this.localStream$.next(null);
    this.remoteStream$.next(null);
  }

  private stopLocalStream() {
    const localStream = this.localStream$.value;
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  }

  async acceptCall(call: MediaConnection) {
    const localStream = await this.getLocalStream();
    call.answer(localStream); // Trả lời cuộc gọi
    this.currentCall = call;

    call.on('stream', (remoteStream: MediaStream) => {
      this.remoteStream$.next(remoteStream);  // Gửi stream từ xa tới component
    });

    call.on('close', () => {
      this.endCall();
    });

  }

  // Phương thức từ chối cuộc gọi
  rejectCall(call: MediaConnection) {

    // Đóng kết nối cuộc gọi
    this.endCall();  // Tắt cả hai bên và stream
    call.close();
  }

  async getLocalStream(): Promise<MediaStream> {
    if (this.localStream$.value) return this.localStream$.value; // Nếu stream đã có, trả về luôn

    const localStream = new MediaStream();
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.getTracks().forEach(track => localStream.addTrack(track));
    } catch (error) {
      console.error('Camera error:', error);
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach(track => localStream.addTrack(track));
    } catch (error) {
      console.error('Microphone error:', error);
    }

    this.localStream$.next(localStream);
    return localStream;
  }

  async makeCall(remotePeerId: string, callOptions: any) {
    const localStream = await this.getLocalStream();

    const call = this.peer.call(remotePeerId, localStream);
    const dataConnection = this.peer.connect(remotePeerId, { reliable: true });

    dataConnection.on('open', () => {
      // Gửi tên và hình ảnh người gọi sau khi kết nối dữ liệu mở
      dataConnection.send({
        userName: callOptions.userName,  // Thay thế bằng tên người gọi thực tế
        userImage: callOptions.userImage  // Thay thế bằng hình ảnh người gọi thực tế
      });
    });


    // Lắng nghe cuộc gọi
    call.on('stream', (remoteStream: MediaStream) => {
      this.remoteStream$.next(remoteStream);
    });

    // Lắng nghe khi cuộc gọi kết thúc
    call.on('close', () => {
      this.endCall();
    });
  }

  isCallActive(): boolean {
    return this.currentCall !== null;
  }
}
