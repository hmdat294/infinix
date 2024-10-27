import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {

  content: string = '';
  conversation: any;
  friends: any;
  requestfriends: any;
  user: any;
  listUser: any;

  spaceCheck: any = /^\s*$/;

  reply_id: any = null;
  previewReply: any = null;

  fileInput: any;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  is_edit_message: boolean = false;
  id_message: number = 0;

  isScrollingToElement: boolean = false;
  isVisible = true;
  showBoxSearch = false;
  showBoxSearchUser = false;

  keywordSearch: string = '';
  valueSearch: any = [];

  keywordSearchUser: string = '';
  valueSearchUser: any = [];

  idDialogChat: number = 0;
  idDialogCreateGroup: boolean = false;

  previousElement: HTMLElement | null = null;
  focusTimeout: any;

  fileImageGroup: any;
  selectedFilesGroup: File[] = [];
  previewGroupImages: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private chatService: ChatService,
    private authService: AuthService,
    private eventService: EventService
  ) { }

  @ViewChild('scrollBox') private scrollBox!: ElementRef;
  @ViewChild('nameGroup') private nameGroup!: ElementRef;

  ngOnInit(): void {

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;
      });

    this.authService.getListUser().subscribe(
      (response) => {
        this.listUser = response.data;
      });

    this.chatService.getListChat().subscribe(
      (data: any) => {
        this.friends = data.data;
        console.log(this.friends);

        this.MessageUser(this.friends[0]);

        this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
          this.isScrollingToElement = false;
          console.log('Message event:', data);
          if (this.conversation.id == data.data.conversation_id)
            this.conversation.messages.push(data.data);
        });

        this.eventService.bindEvent('App\\Events\\UserRecallMessageEvent', (data: any) => {
          console.log('Recall Message event:', data);
          if (this.conversation.id == data.data.conversation_id)
            this.conversation.messages.find((item: any) => item.id === data.data.id).is_recalled = data.data.is_recalled;
        });

        this.eventService.bindEvent('App\\Events\\UserEditMessageEvent', (data: any) => {

          console.log('Edit Message event:', data);
          if (this.conversation.id == data.data.conversation_id)
            this.conversation.messages.find((item: any) => item.id === data.data.id).content = data.data.content;

        });
      });
  }

  ngAfterViewInit() {
    const accordion = this.el.nativeElement.querySelector('.a-accordion-header') as HTMLElement;
    const panel = this.el.nativeElement.querySelector('.accordion-panel-search-chat') as HTMLElement;

    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');
      panel.classList.toggle('open');
      this.showBoxSearch = !this.showBoxSearch;
      panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
    });

    const search_input = panel.querySelector('.search-control-chat > input') as HTMLElement;
    search_input.addEventListener('input', () => {
      panel.style.maxHeight = (panel.classList.contains('open')) ? `${panel.scrollHeight}px` : '0px';
    });

    const accordion_user = this.el.nativeElement.querySelector('.user-accordion-header') as HTMLElement;
    const panel_user = this.el.nativeElement.querySelector('.accordion-panel-search-user') as HTMLElement;

    accordion_user.addEventListener('click', () => {
      accordion_user.classList.toggle('active');
      panel_user.classList.toggle('open');
      this.showBoxSearchUser = !this.showBoxSearchUser;
      panel_user.style.maxHeight = (panel_user.classList.contains('open')) ? `${panel_user.scrollHeight}px` : '0px';
    });

    const search_input_user = panel_user.querySelector('.search-control-user > input') as HTMLElement;
    search_input_user.addEventListener('input', () => {
      panel_user.style.maxHeight = (panel_user.classList.contains('open')) ? `${panel_user.scrollHeight}px` : '0px';
    });

  }

  getPathImg(img: any) {
    return img.path;
  }

  ngAfterViewChecked() {
    if (!this.isScrollingToElement) {
      this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      this.isScrollingToElement = true;
    }
  }

  toggleBoxchat() {
    this.isVisible = !this.isVisible;
  }

  toggleDialogChat(id: number) {
    this.idDialogChat = id;
  }

  toggleDialogCreateGroup() {
    this.idDialogCreateGroup = !this.idDialogCreateGroup;
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

  isDifferentDate(i: number): boolean {
    if (i === 0) return true;
    return this.conversation.messages[i].created_at_date !== this.conversation.messages[i - 1].created_at_date;
  }

  isDifferentUser(i: number, id: number): boolean {
    if (i === this.conversation.messages.length - 1) return true;
    return this.conversation.messages[i + 1].user_id !== id;
  }

  MessageUser(conversation: any) {

    console.log(conversation);

    if (conversation.is_group == 0) {
      // conversation có users là 2 người nên lấy id của người còn lại
      this.authService.getUser(0).subscribe(
        (response) => {
          const receiver_id = conversation.users.find((user: any) => user.id !== response.data.id).id;

          this.chatService.getMessageUser(receiver_id).subscribe(
            (data: any) => {
              this.conversation = data.data;
              this.isScrollingToElement = false;
              (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();
            });
        });
    } else {
      this.chatService.getMessageGroup(conversation.id).subscribe(
        (data: any) => {
          this.conversation = data.data;
          this.isScrollingToElement = false;
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).focus();
        });
    }
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

  resetFileInput() {
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

  searchMessage(): void {
    if (this.keywordSearch && !/^\s*$/.test(this.keywordSearch)) {
      this.valueSearch = this.conversation.messages.filter((msg: any) =>
        msg.content && msg.content.toLowerCase().includes(this.keywordSearch.toLowerCase().trim())
      );
      this.valueSearch.reverse();
    }
    else {
      this.valueSearch = [];
    }
  }

  clearSearchMessage() {
    this.keywordSearch = '';
    this.valueSearch = [];
  }

  searchUser(): void {
    if (this.keywordSearchUser && !/^\s*$/.test(this.keywordSearchUser)) {
      this.valueSearchUser = this.listUser.filter((friend: any) =>
        (
          friend.profile.display_name.toLowerCase().includes(this.keywordSearchUser.trim().toLowerCase())
          || friend.email.toLowerCase().includes(this.keywordSearchUser.trim().toLowerCase()))
        && friend.id != this.user.id
      ).slice(0, 5);
      console.log(this.valueSearchUser);
    }
    else {
      this.valueSearchUser = [];
    }
  }

  clearSearchUser() {
    this.keywordSearchUser = '';
    this.valueSearchUser = [];
  }

  createGroup(value: any) {

    const formData = new FormData();
    formData.append('name', value.name_group);
    if (this.selectedFilesGroup.length > 0)
      formData.append('image', this.selectedFilesGroup[0], this.selectedFilesGroup[0].name);

    this.chatService.createGroup(formData).subscribe(
      (response: any) => {
        console.log(response);
        this.closeCreateGroup();
        this.nameGroup.nativeElement.value = '';
      }
    )
  }

  addGroup(receiver_id: number, conversation_id: number) {
    console.log(receiver_id, conversation_id);

    this.chatService.addGroup({ receiver_id, conversation_id }).subscribe(
      (response: any) => {
        console.log(response);
      }
    )
  }

  onFileImageGroupSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewGroupImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesGroup = [file];
  }

  removeGroupImage(): void {
    this.previewGroupImages = [];
    this.selectedFilesGroup = [];
    if (this.fileImageGroup) this.fileImageGroup.nativeElement.value = '';
  }

  closeCreateGroup() {
    this.toggleDialogCreateGroup();
    this.removeGroupImage();
  }
}
