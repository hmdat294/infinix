import { Injectable } from '@angular/core';
import moment from 'moment';
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  data_post: any = {};

  public peer: Peer;
  private currentCall: MediaConnection | null = null;
  public currentDataConnection: DataConnection | null = null;

  public userPeerId$ = new BehaviorSubject<string | null>(null);
  public localStream$ = new BehaviorSubject<MediaStream | null>(null);
  public remoteStream$ = new BehaviorSubject<MediaStream | null>(null);

  private userInfomation = new BehaviorSubject<any>(null);
  userInfomation$ = this.userInfomation.asObservable();

  private userTemp = new BehaviorSubject<any>(null);
  userTemp$ = this.userTemp.asObservable();

  private statusCamera = new BehaviorSubject<any>('Default Value');
  statusCamera$ = this.statusCamera.asObservable();

  private statusMicro = new BehaviorSubject<any>('Default Value');
  statusMicro$ = this.statusMicro.asObservable();

  private statusCalling = new BehaviorSubject<any>(false);
  statusCalling$ = this.statusCalling.asObservable();

  private timeOut = new BehaviorSubject<any>(null);
  timeOut$ = this.timeOut.asObservable();

  updateInfo(newValue: any) {
    this.userInfomation.next(newValue);
  }
  updateUserTemp(newValue: any) {
    this.userTemp.next(newValue);
  }
  updateStatusCamera(newValue: any) {
    this.statusCamera.next(newValue);
  }
  updateStatusMicro(newValue: any) {
    this.statusMicro.next(newValue);
  }
  updateCalling(newValue: any) {
    this.statusCalling.next(newValue);
  }
  updateTimeOut(newValue: any) {
    this.timeOut.next(newValue);
  }

  constructor(private chatService: ChatService) {
    this.timeOut$.subscribe((value) => this.data_post.second = value);
    const peedId = localStorage.getItem('user_code');
    this.peer = new Peer(String(peedId));

    this.peer.on('open', id => this.userPeerId$.next(id));
    this.peer.on('call', async (call: MediaConnection) => this.remoteStream$.next(null));
    this.peer.on('connection', (connection: DataConnection) => this.setupDataConnection(connection));
  }

  public setupDataConnection(connection: DataConnection) {
    this.currentDataConnection = connection;
    this.sendSignal('START_CALL');

    connection.on('data', (message: any) => this.handleIncomingMessage(message));
    connection.on('close', () => {

      //dữ liệu gửi đi
      if (this.data_post.second) {
        this.data_post.second = moment
          .utc(this.data_post.second * 1000)
          .format("m [phút] s [giây]");

        const formData = new FormData();

        formData.append('conversation_id', this.data_post.conversationId);
        formData.append('content', this.data_post.second);
        formData.append('is_call', String(1));

        this.chatService.sendMessage(formData).subscribe(
          (response: any) => {
            console.log(response);
          }
        );
      }

      console.log('Kết nối đã bị ngắt.');
      this.updateInfo(null);
      this.updateTimeOut(null);
      this.endCall();
    });
  }

  public handleIncomingMessage(message: any) {
    switch (message.type) {
      case 'START_CALL':
        console.log('Đối phương đã chấp nhận cuộc gọi.');
        this.userTemp$.subscribe((user) => this.updateInfo(user));
        break;
      case 'TOGGLE_CAMERA':
        this.updateStatusCamera(message.value);
        break;
      case 'TOGGLE_MIC':
        this.updateStatusMicro(message.value);
        break;
      case 'END_CALL':
        this.updateInfo(null);
        this.endCall();
        break;
      case 'TIME_OUT':
        this.updateTimeOut(message.value);
        break;
      default:
        this.updateInfo(message);
    }
  }

  sendSignal(type: string, value: any = null) {
    if (this.currentDataConnection) this.currentDataConnection.send({ type, value });
  }

  toggleCamera(enabled: boolean) {
    const localStream = this.localStream$.value;
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
        this.sendSignal('TOGGLE_CAMERA', enabled);
      }
    }
  }

  toggleMicrophone(enabled: boolean) {
    const localStream = this.localStream$.value;
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
        this.sendSignal('TOGGLE_MIC', enabled);
      }
    }
  }

  endCall() {
    if (this.currentCall) {
      this.currentCall.close();
      this.currentCall = null;
    }
    if (this.currentDataConnection) {
      this.sendSignal('END_CALL');
      this.currentDataConnection.close();
      this.currentDataConnection = null;
    }
    this.stopLocalStream();
    this.localStream$.next(null);
    this.remoteStream$.next(null);
  }

  private stopLocalStream() {
    const localStream = this.localStream$.value;
    if (localStream) localStream.getTracks().forEach(track => track.stop());
  }

  async acceptCall(call: MediaConnection) {
    const localStream = await this.getLocalStream();
    call.answer(localStream);
    this.currentCall = call;

    call.on('stream', (remoteStream: MediaStream) => this.remoteStream$.next(remoteStream));
    call.on('close', () => this.endCall());
  }

  rejectCall(call: MediaConnection) {
    this.endCall();
    call.close();
  }

  async getLocalStream(): Promise<MediaStream> {
    if (this.localStream$.value) return this.localStream$.value;

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
    console.log(remotePeerId);
    
    const localStream = await this.getLocalStream();

    const call = this.peer.call(remotePeerId, localStream);
    const dataConnection = this.peer.connect(remotePeerId, { reliable: true });

    dataConnection.on('open', () => {
      dataConnection.send({
        userName: callOptions.userName,
        userImage: callOptions.userImage
      });
    });

    this.data_post = {
      'userId': callOptions.userId,
      'conversationId': callOptions.conversationId,
    };

    this.updateStatusCamera(true);
    this.updateStatusMicro(true);

    call.on('stream', (remoteStream: MediaStream) => this.remoteStream$.next(remoteStream));
    call.on('close', () => this.endCall());
  }

  isCallActive(): boolean {
    return this.currentCall !== null;
  }
}
