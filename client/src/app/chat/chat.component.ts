import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  content: string = '';
  conversation: any;
  friends: any;
  requestfriends: any;
  user: any;
  spaceCheck: any = /^\s*$/;

  reply_id: any = null;
  previewReply: any = null;

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  is_edit_message: boolean = false;
  id_message: number = 0;

  isScrollingToElement: boolean = false;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  @ViewChild('scrollBox') private scrollBox!: ElementRef;



  isVisible = false;

  toggle() {
    this.isVisible = !this.isVisible;
  }


  ngAfterViewChecked() {
    if (!this.isScrollingToElement) {
      this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      this.isScrollingToElement = true;
    }
  }

  scrollToElement(index: number) {
    console.log(index);
    
    this.isScrollingToElement = true;
    const targetElement = document.getElementById(`item-${index - 1}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnInit(): void {

    if (localStorage.getItem('auth_token')) {
      this.authService.getUser(0).subscribe(
        (response) => {
          this.user = response.data;
        });
    }

    this.authService.getFriend().subscribe(
      (data: any) => {
        this.friends = data;
        this.MessageUser((this.friends.data.length > 0) ? this.friends.data[0].id : '');
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
    console.log(id);

    this.chatService.getMessageUser(id).subscribe(
      (data: any) => {
        this.conversation = data.data;
        console.log(this.conversation);

        (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();

        this.chatService.setConversationId(this.conversation.id);
        // this.conversation.messages.reverse();

        this.chatService.bindEventChat('App\\Events\\MessageSent', (data: any) => {

          console.log('Message received:', data);

          // if (data.is_recalled == 0) this.conversation.messages.unshift(data);
          // else if (data.is_recalled == 1) this.conversation.messages.find((item: any) => item.id === data.id).is_recalled = data.is_recalled;

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
    if (!this.is_edit_message) {

      const formData = new FormData();
      formData.append('conversation_id', mess.id.toString());
      formData.append('content', mess.content);

      if (this.reply_id) {
        formData.append('reply_to_message_id', this.reply_id);
      }

      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach(image => {
          formData.append('medias[]', image, image.name);
        });
      }

      this.chatService.sendMessage(formData).subscribe(
        (response: any) => {
          console.log(response);
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = '32px';
          this.content = '';
          this.onCancelSendImg();
          this.onCancelReply();
        }
      );
    }
    else {
      this.chatService.recallMessage(this.id_message, { 'content': mess.content }).subscribe(
        (response) => {
          console.log(response);
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = '32px';
          this.content = '';
          this.onCancelSendImg();
          this.onCancelReply();
          this.is_edit_message = false;
        }
      );
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
    message.is_recalled = 1;
    message.showUndoBtn = true;
    message.countdown = 3;

    this.countdownIntervals[id] = setInterval(() => {
      if (message.countdown > 0) message.countdown--;
      else {
        this.chatService.recallMessage(id, { 'is_recalled': 1 }).subscribe(
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
    message.is_recalled = 0;
    message.showUndoBtn = false;
    clearInterval(this.countdownIntervals[id]);
  }

  getReply(id: number) {
    const reply = this.conversation.messages.find((data: any) => data.id == id);

    return {
      content: reply.content,
      images: reply.medias[0],
      is_recalled: reply.is_recalled,
      user_id: reply.user_id
    };
  }

  onReply(id: number) {
    this.reply_id = id;
    const reply = this.conversation.messages.find((data: any) => data.id == id);
    this.previewReply = reply;
    (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();
  }

  editMessage(id: number) {
    const message = this.conversation.messages.find((item: any) => item.id === id);
    console.log(message);
    this.previewReply = message;
    this.content = message.content;
    this.is_edit_message = true;
    this.id_message = message.id;
  }

  onCancelReply() {
    this.reply_id = null;
    this.previewReply = null;
  }

}
