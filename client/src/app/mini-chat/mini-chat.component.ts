import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { EventService } from '../service/event.service';
import { ChatService } from '../service/chat.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-mini-chat',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, EmojiModule, PickerComponent],
  templateUrl: './mini-chat.component.html',
  styleUrl: './mini-chat.component.css'
})
export class MiniChatComponent implements OnInit, AfterViewChecked {

  user: any;
  friends: any = [];
  filteredConversations: any = [];
  keyword: string = '';
  currentRoute: string | undefined;
  conversation: any[] = [];
  chat: any = null;
  listChat: any = [];
  showChat: boolean = false;
  showBoxMiniChat: boolean = false;
  idDialogChat: number = 0;
  isScrollingToElement: boolean = false;
  previousElement: HTMLElement | null = null;
  focusTimeout: any;
  reply_id: any = null;
  previewReply: any = null;
  content: string = '';
  is_edit_message: boolean = false;
  id_message: number = 0;
  countdownIntervals: any = {};
  fileInput: any;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  spaceCheck: any = /^\s*$/;


  @ViewChild('scrollBox') private scrollBox!: ElementRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private eventService: EventService,
    private chatService: ChatService,
  ) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url.split('/')[1];
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(
      (event: any) => this.currentRoute = event.urlAfterRedirects.split('/')[1]
    );


    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;

        // this.conversation = JSON.parse(localStorage.getItem('conversation') || '[]');

        this.chatService.conversation$.subscribe(conversation => {
          // console.log('Updated conversation from localStorage:', conversation);
          this.conversation = conversation;
          this.filterListChat();

          if (this.chatService.tagOpenBoxChat) {
            this.chatService.tagOpenBoxChat = false;
            this.showChat = true;
            this.getMiniChat(conversation[conversation.length - 1]);
          }
          else {
            this.showChat = false;
          }
        });

        this.chatService.getListChat().subscribe(
          (data: any) => {
            const listChat = data.data;

            this.listChat = listChat.map((item: any) => ({
              ...item,
              users: item.users.filter((user: any) => user.id !== this.user?.id)
            }))

            this.filterListChat();

            if (!this.chat)
              this.chat = this.filteredConversations[0];
            console.log(this.chat);

            this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
              console.log('Message received:', data);

              if (this.conversation.includes(data.data.conversation_id))
                this.conversation = this.conversation.filter(id => id !== data.data.conversation_id);

              if (this.conversation.length >= 5)
                this.conversation.shift();

              this.conversation.push(data.data.conversation_id);

              this.filterListChat();

              this.isScrollingToElement = false;
              if (this.chat?.id == data.data.conversation_id)
                this.chat.messages.push(data.data);
            });

            this.eventService.bindEvent('App\\Events\\UserRecallMessageEvent', (data: any) => {
              console.log('Recall Message event:', data);
              if (this.chat.id == data.data.conversation_id)
                this.chat.messages.find((item: any) => item.id === data.data.id).is_recalled = data.data.is_recalled;
            });

            this.eventService.bindEvent('App\\Events\\UserEditMessageEvent', (data: any) => {
              console.log('Edit Message event:', data);
              if (this.chat.id == data.data.conversation_id)
                this.chat.messages.find((item: any) => item.id === data.data.id).content = data.data.content;
            });
          });
      });
  }

  deleteMiniChat(conversation_id: number) {
    this.conversation = this.conversation.filter(id => id !== conversation_id);
    this.chatService.updateConversation(this.conversation);
    this.showBoxMiniChat = false;
    this.filterListChat();
  }

  getMiniChat(conversation_id: number) {
    this.showBoxMiniChat = true;
    this.isScrollingToElement = false;
    this.chat = this.filteredConversations.find((item: any) => item.id == conversation_id);
  }

  showChatBubble() {
    if (this.conversation.length > 0) {
      this.showChat = !this.showChat;
      if (this.showChat == false) this.showBoxMiniChat = false;
    }
  }

  filterListChat() {
    this.filteredConversations = this.listChat.filter((convo: any) =>
      this.conversation.includes(convo.id)
    ).sort((a: any, b: any) =>
      this.conversation.indexOf(a.id) - this.conversation.indexOf(b.id)
    );

    // console.log(this.filteredConversations);
  }


  toggleDialogChat(id: number) {
    this.idDialogChat = id;
  }


  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.cancelFriend(receiver_id).subscribe(
      (response) => {
        console.log(response);
      });
  }

  shortenTextByWords(text: string, maxWords: number): string {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  }

  getReply(id: number) {
    const reply = this.chat.messages.find((data: any) => data.id == id);

    return {
      content: reply.content,
      images: reply.medias[0],
      is_recalled: reply.is_recalled,
      user_id: reply.user_id
    };
  }

  scrollToElement(index: number) {
    this.isScrollingToElement = true;

    const targetElement = document.getElementById(`item-${index}`);
    const messChild = targetElement?.querySelector('.mess-child') as HTMLElement;

    if (this.previousElement) this.previousElement.classList.remove('border-focus');

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (messChild) {
        messChild.classList.add('border-focus');
        this.previousElement = messChild;

        if (this.focusTimeout) clearTimeout(this.focusTimeout);

        this.focusTimeout = setTimeout(() => {
          messChild.classList.remove('border-focus');
          this.previousElement = null;
        }, 3000);
      }
    }
  }

  ngAfterViewChecked() {
    if (this.scrollBox && this.scrollBox.nativeElement && !this.isScrollingToElement) {
      this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      this.isScrollingToElement = true;
    }
  }

  getPathImg(img: any) {
    return img.path;
  }

  copyMessage(message: string) {
    navigator.clipboard.writeText(message)
      .then(() => console.log('Copy success.'))
      .catch(err => console.error('Copy: ', err));
  }

  isDifferentDate(i: number): boolean {
    if (i === 0) return true;
    return this.chat.messages[i].created_at_date !== this.chat.messages[i - 1].created_at_date;
  }

  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (!textarea.value) {
      textarea.style.height = '32px'; // Chiều cao mặc định khi không có nội dung
    } else if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  onReply(id: number) {
    this.reply_id = id;
    const reply = this.chat.messages.find((data: any) => data.id == id);
    this.previewReply = reply;
    (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();
  }

  editMessage(id: number) {
    const message = this.chat.messages.find((item: any) => item.id === id);
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

  //pin

  pinMessage(message_id: number) {
    this.chatService.pinMessage(message_id).subscribe(
      (data: any) => {
        console.log(data);

        if (data.message == "Pinned")
          this.chat.pinned_messages.push(data.data);
        else if (data.message == "Unpinned")
          this.chat.pinned_messages = this.chat.pinned_messages.filter((item: any) => item.id !== message_id);

      });
  }

  checkPined(message_id: number): boolean {
    return this.chat.pinned_messages.some((item: any) => item.id === message_id);
  }

  dialogPin: boolean = false;
  checkPinLength(message_id: number) {
    if (this.chat.pinned_messages.length > 2) this.dialogPin = true;
    else this.pinMessage(message_id);
  }

  morePin: boolean = false;
  morePinMessage() {
    this.morePin = !this.morePin;
  }

  //pin

  //block

  blockUser(user_id: number) {
    this.authService.postUserBlock(user_id).subscribe(
      (response: any) => {
        console.log(response);
        this.chat.users[0].blocked_user = !this.chat.users[0].blocked_user;
      });
  }

  //block

  recallMessage(id: number) {
    const message = this.chat.messages.find((item: any) => item.id === id);
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
    const message = this.chat.messages.find((item: any) => item.id === id);
    message.is_recalled = 0;
    message.showUndoBtn = false;
    clearInterval(this.countdownIntervals[id]);
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

  vietnameseI18n: any = {
    search: 'Tìm kiếm',
    categories: {
      search: 'Kết quả tìm kiếm',
      recent: 'Gần đây',
      people: 'Mọi người',
      nature: 'Thiên nhiên',
      foods: 'Đồ ăn & Uống',
      activity: 'Hoạt động',
      places: 'Địa điểm',
      objects: 'Đồ vật',
      symbols: 'Biểu tượng',
      flags: 'Cờ',
    },
    skinTones: {
      1: 'Màu da mặc định',
      2: 'Màu da sáng',
      3: 'Màu da trung bình sáng',
      4: 'Màu da trung bình',
      5: 'Màu da trung bình tối',
      6: 'Màu da tối',
    },
  };



  showEmojiPicker: boolean = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.content += event.emoji.native;
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

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
