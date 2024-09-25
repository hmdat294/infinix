import { Component, OnInit } from '@angular/core';
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
  list: any;
  user: any;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  reply_id: any = null;
  previewReply: any = null;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUser().subscribe(
      (response) => this.user = response);

    this.chatService.getList().subscribe(
      (data: any) => {
        this.list = data.users;

        this.MessageUser(this.list[0].id);
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

        this.chatService.setConversationId(this.conversation.conversation_id);
        this.conversation.messages.reverse();

        this.chatService.bindEvent('App\\Events\\MessageSent', (data: any) => {

          console.log('Message received:', data);

          if (data.recalls == 0) this.conversation.messages.unshift(data);
          else if (data.recalls == 1) this.conversation.messages.find((item: any) => item.id === data.id).recalls = data.recalls;

        });
      });
  }

  sendMessage(mess: any) {
    const formData = new FormData();
    formData.append('conversation_id', mess.conversation_id.toString());
    formData.append('message', mess.message);

    if (this.reply_id) {
      formData.append('reply_id', this.reply_id);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
      mess['image'] = formData;
    }

    this.chatService.sendMessage(formData).subscribe(
      (response: any) => {
        this.message = '';
        this.onCancelSendImg();
        this.onCancelReply();
        console.log(response);
      });
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
    return [reply.message, reply.image, reply.recalls];
  }

  onReply(id: number) {
    this.reply_id = id;
    const reply = this.conversation.messages.filter((data: any) => data.id == id)[0];
    this.previewReply = reply;
    console.log(reply);
  }

  onCancelReply() {
    this.reply_id = null;
    this.previewReply = null;
  }

  onCancelSendImg() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.resetFileInput();
  }

  fileInput: any;
  private resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }


}
