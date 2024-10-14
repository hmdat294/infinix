import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  message: string = '';
  conversation: any;
  friend: any;
  requestfriends: any;
  user: any;

  reply_id: any = null;
  previewReply: any = null;

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      this.authService.getUser(0).subscribe(
        (response) => this.user = response);
    }

    this.chatService.getList().subscribe(
      (data: any) => {
        this.friend = data;
        console.log(this.friend);

        this.MessageUser((this.friend.length > 0) ? this.friend[0].id : '');
      });

    this.authService.getRequestFriend().subscribe(
      (data: any) => {
        this.requestfriends = data;
      });
  }

  isDifferentDate(i: number): boolean {
    if (i === this.conversation.messages.length - 1) return true;
    return this.conversation.messages[i].date !== this.conversation.messages[i + 1].date;
  }

  isDifferentUser(i: number, id: number): boolean {
    if (i === this.conversation.messages.length - 1) return true;
    return this.conversation.messages[i + 1].user_id !== id;
  }

  MessageUser(id: number) {
    this.chatService.getMessageUser(id).subscribe(
      (data: any) => {
        this.conversation = data;
        console.log(data);

        (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();

        this.chatService.setConversationId(this.conversation.conversation_id);
        this.conversation.messages.reverse();

        this.chatService.bindEventChat('App\\Events\\MessageSent', (data: any) => {

          console.log('Message received:', data);

          if (data.recalls == 0) this.conversation.messages.unshift(data);
          else if (data.recalls == 1) this.conversation.messages.find((item: any) => item.id === data.id).recalls = data.recalls;

        });
      });
  }

  acceptFriend(id: number): void {
    this.authService.acceptFriend(id).subscribe(
      (response) => console.log(response)
    )
  }

  refuseFriend(id: number): void {
    this.authService.refuseFriend(id).subscribe(
      (response) => console.log(response)
    )
  }

  sendMessage(mess: any) {
    if (mess.message && mess.message != null && mess.message != ' ') {

      const formData = new FormData();
      formData.append('conversation_id', mess.conversation_id.toString());
      formData.append('message', mess.message);

      if (this.reply_id) {
        formData.append('reply_id', this.reply_id);
      }

      if (this.selectedFiles.length > 0) {

        this.selectedFiles.forEach(image => {
          formData.append('images[]', image, image.name);
        });
      }

      this.chatService.sendMessage(formData).subscribe(
        (response: any) => {
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = 'auto';
          this.message = '';
          this.onCancelSendImg();
          this.onCancelReply();
          console.log(response);
        });
    }
  }

  fileInput: any;
  private resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => this.previewUrls.push(reader.result as string);
        reader.readAsDataURL(file);
        this.selectedFiles.push(file);
      });
    }
  }

  onCancelSendImg() {
    this.selectedFiles = [];
    this.previewUrls = [];
    this.resetFileInput();
  }

  removeImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  handleKeydown(event: KeyboardEvent, frm: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage(frm);
    }
  }

  countdownIntervals: any = {};

  recallMessage(id: number) {
    const message = this.conversation.messages.find((item: any) => item.id === id);
    message.recalls = 1;
    message.showUndoBtn = true;
    message.countdown = 3;

    this.countdownIntervals[id] = setInterval(() => {
      if (message.countdown > 0) message.countdown--;
      else {
        this.chatService.recallMessage(id).subscribe(
          (response) => console.log(response),
          (error) => console.error('Error recalling message', error)
        );
        message.showUndoBtn = false;
        clearInterval(this.countdownIntervals[id]);
      }
    }, 1000);
  }

  undoRecall(id: number) {
    const message = this.conversation.messages.find((item: any) => item.id === id);
    message.recalls = 0;
    message.showUndoBtn = false;
    clearInterval(this.countdownIntervals[id]);
  }

  getReply(id: number) {
    const reply = this.conversation.messages.filter((data: any) => data.id == id)[0];
    return {
      message: reply.message,
      images: reply.images,
      recalls: reply.recalls,
      user_id: reply.user_id
    };
  }

  onReply(id: number) {
    this.reply_id = id;

    const reply = this.conversation.messages.filter((data: any) => data.id == id)[0];
    this.previewReply = reply;

    (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();
  }

  onCancelReply() {
    this.reply_id = null;
    this.previewReply = null;
  }
}