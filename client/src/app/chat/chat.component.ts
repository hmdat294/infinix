import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { EventService } from '../service/event.service';
import { RouterModule } from '@angular/router';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { SettingService } from '../service/setting.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../service/notification.service';
import { PeerService } from '../service/peer.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule, RouterModule, EmojiModule, PickerComponent, TranslateModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {

  content: string = '';
  conversation: any;
  friends: any;
  requestfriends: any;
  user: any;
  images: any;
  listUser: any;

  spaceCheck: any = /^\s*$/;

  reply_id: any = null;
  previewReply: any = null;

  fileInput: any;
  selectedFiles: File[] = [];
  previewUrls: any[] = [];

  id_edit_message: number = 0;

  isScrollingToElement: boolean = false;
  showBoxSearch = false;
  showBoxSearchUser = false;
  showUserGroup = false;

  keywordSearch: string = '';
  valueSearch: any = [];

  keywordSearchUser: string = '';
  valueSearchUser: any = [];

  idDialogChat: number = 0;

  previousElement: HTMLElement | null = null;
  focusTimeout: any;
  countdownIntervals: any = {};

  idDialogCreateGroup: boolean = false;
  fileImageGroup: any;
  selectedFilesGroup: File[] = [];
  previewGroupImages: string[] = [];

  idDialogEditGroup: boolean = false;
  fileImageEditGroup: any;
  selectedFilesEditGroup: File[] = [];
  previewEditGroupImages: string[] = [];

  keyword: string = '';
  friendsSearch: any = [];
  friendsFilter: any = [];
  countNotification: any = [];

  constructor(
    private el: ElementRef,
    private chatService: ChatService,
    private authService: AuthService,
    private eventService: EventService,
    private settingService: SettingService,
    private notificationService: NotificationService,
    private peerService: PeerService
  ) { }

  @ViewChild('scrollBox') private scrollBox!: ElementRef;
  @ViewChild('nameGroup') private nameGroup!: ElementRef;
  @ViewChild('nameEditGroup') private nameEditGroup!: ElementRef;

  ngOnInit(): void {

    this.authService.getListUser().subscribe(
      (response) => {
        this.listUser = response.data;
      });

    this.notificationService.sharedNotiChat$.subscribe((value) => {
      if (Array.isArray(value)) {
        this.countNotification = value.reduce((acc: any, curr: any) => {
          const id = curr.conversation_id;
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});
      }
    });

    this.authService.getUser(0).subscribe(
      (response) => {
        this.user = response.data;

        this.chatService.getListChat().subscribe(
          (data: any) => {
            const friends = data.data || null;

            this.friends = friends.map((item: any) => ({
              ...item,
              users: item.users.filter((user: any) => user.id !== this.user?.id)
            }))
            console.log(this.friends);

            if (this.friends.length > 0) {
              this.MessageUser(this.friends[0]);
            }

            this.eventService.bindEvent('App\\Events\\UserBlockUserEvent', (data: any) => {
              // console.log('Block event:', data);
              const blocker = data.blocker;
              const type = data.type;
              this.friends.find((friend: any) =>
                friend.users[0].id == blocker.id && friend.is_group == 0)
                .users[0].blocked_by_user = (type == "block") ? true : false;
            });


            this.eventService.bindEvent('App\\Events\\UserSendMessageEvent', (data: any) => {
              this.isScrollingToElement = false;
              console.log('Message event:', data);

              // if (this.conversation?.id == data.data?.conversation_id)
              // this.conversation.messages.push(data.data);

              const conversation = this.friends.find((conv: any) => conv.id == data.data?.conversation_id)
              conversation.messages.push(data.data);

              if (this.user.id !== data.data.user_id) {

                const user_receiver = this.friends.find((user: any) => user.users[0].id == data.data.user_id)

                if (!user_receiver) {
                  this.chatService.getMessageUser(data.data.user_id).subscribe(
                    (response: any) => {
                      // console.log(response);
                      this.friends.unshift(response.data);
                    });
                }
              }
            });

            this.eventService.bindEvent('App\\Events\\UserRecallMessageEvent', (data: any) => {
              // console.log('Recall Message event:', data);
              if (this.conversation.id == data.data.conversation_id)
                this.conversation.messages.find((item: any) => item.id === data.data.id).is_recalled = data.data.is_recalled;
            });

            this.eventService.bindEvent('App\\Events\\UserEditMessageEvent', (data: any) => {
              // console.log('Edit Message event:', data);
              if (this.conversation.id == data.data.conversation_id) {
                const mess = this.conversation.messages.find((item: any) => item.id === data.data.id);
                mess.content = data.data.content;
                mess.medias = data.data.medias;
                mess.is_edited = data.data.is_edited;
              }
            });

            this.eventService.bindEvent('App\\Events\\UserLikeMessageEvent', (data: any) => {
              // console.log('Like Message event:', data);
              if (this.conversation.id == data.message.conversation_id) {
                const mess = this.conversation.messages.find((item: any) => item.id === data.message.id);
                mess.likes = data.message.likes;
              }
            });
          });
      });

    this.updateClassTab(window.innerWidth);

  }


  
  
  remotePeerId: string = '';

  async makeCall() {
    this.remotePeerId = 'infinix-user-' + this.conversation.users[0].id;

    if (this.remotePeerId) {

      this.peerService.updateCalling(true);

      const callOptions = {
        userId: this.user.id,
        conversationId: this.conversation.id,
        userName: this.user.profile.display_name,
        userImage: this.user.profile.profile_photo,
      };

      this.peerService.updateUserTemp({
        userName: this.conversation.users[0].profile.display_name,
        userImage: this.conversation.users[0].profile.profile_photo,
      });

      this.peerService.updateInfo(null);
      this.peerService.makeCall(this.remotePeerId, callOptions);
    }
  }







  tab_1: boolean = true;
  tab_2: boolean = false;
  tab_3: boolean = true;
  widthChat: number = 0;

  longText: number = 0;
  @ViewChild('elementText', { static: false }) elementText!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateClassTab(event.target.innerWidth);
    this.longText = Math.round(this.elementText.nativeElement.offsetWidth / 50);
    this.longText = this.longText > 8 ? 8 : this.longText == 0 ? 6 : this.longText;
  }

  updateClassTab(width: number) {
    this.tab_1 = width <= 850 ? false : true;
    this.widthChat = width;
  }




  toggleBoxchat() {

    this.tab_2 = !this.tab_2;
    if (this.widthChat <= 480)
      this.tab_3 = !this.tab_2;

    else if (this.tab_2 && this.widthChat <= 850)
      this.tab_1 = !this.tab_2;

  }

  showConversation() {
    if (this.widthChat <= 850) {

      this.tab_1 = !this.tab_1;
      if (this.tab_1)
        this.tab_2 = !this.tab_1;

    }
  }





  shortenTextByWords(text: string, maxWords: number): string {
    return this.settingService.shortenTextByWords(text, maxWords);
  }



  searchFriend() {

    if (this.keyword && !/^\s*$/.test(this.keyword)) {
      this.friendsSearch = this.friendsFilter.filter((friend: any) => {
        const keyword = this.settingService.removeVietnameseTones(this.keyword.trim().toLowerCase());
        const groupName = this.settingService.removeVietnameseTones(friend.name?.toLowerCase() || "");
        const displayName = this.settingService.removeVietnameseTones(friend.users[0]?.profile.display_name.toLowerCase() || "");
        const email = this.settingService.removeVietnameseTones(friend.users[0]?.email.toLowerCase() || "");

        return displayName.includes(keyword) || email.includes(keyword) || groupName.includes(keyword);
      });
    }
    else {
      this.friendsSearch = [];
    }
  }

  addFriend(receiver_id: number): void {
    this.authService.addFriend(receiver_id).subscribe(
      (response) => {
        // console.log(response);
      });
  }

  cancelRequest(receiver_id: number) {
    this.authService.cancelFriend(receiver_id).subscribe(
      (response) => {
        // console.log(response);
      });
  }

  setFriendSearch() {
    return (this.friendsSearch.length > 0) ? this.friendsSearch : this.friends;
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

    const accordion_group = this.el.nativeElement.querySelector('.group-accordion-header') as HTMLElement;
    const panel_group = this.el.nativeElement.querySelector('.accordion-panel-group-user') as HTMLElement;

    accordion_group.addEventListener('click', () => {
      accordion_group.classList.toggle('active');
      panel_group.classList.toggle('open');
      this.showUserGroup = !this.showUserGroup;
      panel_group.style.maxHeight = (panel_group.classList.contains('open')) ? `${panel_group.scrollHeight}px` : '0px';
    });
  }

  getPathImg(img: any) {
    return { 'path': img.path, 'type': img.type };
  }

  copyMessage(message: string) {
    navigator.clipboard.writeText(message)
      .then(() => console.log('Copy success.'))
      .catch(err => console.error('Copy: ', err));
  }

  ngAfterViewChecked() {
    if (this.scrollBox && this.scrollBox.nativeElement && !this.isScrollingToElement) {
      this.scrollBox.nativeElement.scrollTop = this.scrollBox.nativeElement.scrollHeight;
      this.isScrollingToElement = true;
    }
  }

  toggleDialogChat(id: number) {
    this.idDialogChat = id;
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

    if (this.widthChat <= 480) {
      this.tab_1 = false;
      this.tab_2 = false;
    }

    this.chatService.getImageByConversation(conversation.id).subscribe(
      (response) => {
        this.images = response.data;
      }
    )

    this.conversation = conversation;
    console.log(this.conversation);

    if (this.countNotification[conversation.id] > 0) {
      this.notificationService.deleteNotificationChat(conversation.id).subscribe(
        (response) => {
          console.log(response);
          this.countNotification[conversation.id] = 0;
        });
    }

    this.isScrollingToElement = false;
    (document.querySelector('.textarea-chat') as HTMLTextAreaElement)?.focus();

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
    if (this.id_edit_message == 0) {

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
          // console.log(response);
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = '32px';
          this.content = '';
          this.onCancelSendImg();
          this.onCancelReply();
          this.showEmojiPicker = false;
        }
      );
    }
    else {
      const urlImg = this.previewUrls.filter(url => url.path.startsWith("http"));

      const formData = new FormData();
      formData.append('content', mess.content);

      if (this.selectedFiles.length > 0)
        this.selectedFiles.forEach(image => formData.append('medias[]', image, image.name));

      if (urlImg.length > 0) {
        urlImg.forEach(imagePath => {
          const data = {
            path: imagePath.path,
            type: imagePath.type
          };
          formData.append('urls[]', JSON.stringify(data));
        });
      }

      this.chatService.recallMessage(this.id_edit_message, formData).subscribe(
        (response) => {
          // console.log(response);
          (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = '32px';
          this.content = '';
          this.onCancelSendImg();
          this.onCancelReply();
          this.showEmojiPicker = false;
          this.id_edit_message = 0;
        }
      );
    }
  }

  editMessage(id: number) {
    if (id > 0) {
      const message = this.conversation.messages.find((item: any) => item.id === id);
      // console.log(message);
      this.previewUrls = [...message.medias];
      this.content = message.content;
      this.id_edit_message = message.id;
    }
    else {
      (document.querySelector('.textarea-chat') as HTMLTextAreaElement).style.height = '32px';
      this.content = '';
      this.onCancelSendImg();
      this.onCancelReply();
      this.showEmojiPicker = false;
      this.id_edit_message = 0;
    }
  }


  onFileSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
          // Xử lý ảnh
          reader.onload = () => this.previewUrls.push({ type: 'image/webp', path: reader.result as string });
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          // Xử lý video
          const videoURL = URL.createObjectURL(file);
          this.previewUrls.push({ type: 'video/mp4', path: videoURL });
        }

        // Lưu tệp vào danh sách đã chọn
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




  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


  recallMessage(id: number) {
    const message = this.conversation.messages.find((item: any) => item.id === id);
    message.is_recalled = 1;
    message.showUndoBtn = true;
    message.countdown = 3;

    this.countdownIntervals[id] = setInterval(() => {
      if (message.countdown > 0) message.countdown--;
      else {
        this.chatService.recallMessage(id, { 'is_recalled': 1 }).subscribe(
          (response) => {
            // console.log(response);
            if (this.checkPined(id)) this.pinMessage(id);
          },
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
    (document.querySelector('.textarea-chat') as HTMLTextAreaElement)?.focus();
  }

  onCancelReply() {
    this.reply_id = null;
    this.previewReply = null;
  }

  //pin

  pinMessage(message_id: number) {
    this.chatService.pinMessage(message_id).subscribe(
      (data: any) => {
        // console.log(data);

        if (data.message == "Pinned")
          this.conversation.pinned_messages.push(data.data);
        else if (data.message == "Unpinned")
          this.conversation.pinned_messages = this.conversation.pinned_messages.filter((item: any) => item.id !== message_id);

      });
  }

  checkPined(message_id: number): boolean {
    return this.conversation.pinned_messages.some((item: any) => item.id === message_id);
  }

  dialogPin: boolean = false;
  checkPinLength(message_id: number) {
    if (this.conversation.pinned_messages.length > 2) this.dialogPin = true;
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
        // console.log(response);
        this.conversation.users[0].blocked_user = !this.conversation.users[0].blocked_user;
      });
  }

  //block

  //like
  likeMessage(message_id: number) {
    this.chatService.likeMessage(message_id).subscribe(
      (response: any) => {
        // console.log(response);
        const message = this.conversation.messages.find((item: any) => item.id === message_id);
        message.liked = !message.liked;
      }
    )
  }
  //like

  searchMessage(): void {
    if (this.keywordSearch && !/^\s*$/.test(this.keywordSearch)) {

      this.valueSearch = this.conversation.messages.filter((msg: any) => {
        if (msg.is_recalled == 0) {
          const keywordSearch = this.settingService.removeVietnameseTones(this.keywordSearch.trim().toLowerCase());
          const msgContent = this.settingService.removeVietnameseTones(msg.content?.toLowerCase() || "");

          return msgContent.includes(keywordSearch);
        }
        else {
          return false;
        }
      });

      this.valueSearch.reverse();
    } else {
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
    }
    else {
      this.valueSearchUser = [];
    }
  }

  clearSearchUser() {
    this.keywordSearchUser = '';
    this.valueSearchUser = [];
  }

  toggleDialogCreateGroup() {
    this.idDialogCreateGroup = !this.idDialogCreateGroup;
  }

  createGroup(value: any) {
    const formData = new FormData();
    formData.append('name', value.name_group);
    if (this.selectedFilesGroup.length > 0)
      formData.append('image', this.selectedFilesGroup[0], this.selectedFilesGroup[0].name);

    this.chatService.createGroup(formData).subscribe(
      (response: any) => {
        // console.log(response);
        this.closeCreateGroup();
        this.nameGroup.nativeElement.value = '';
        this.friends.unshift(response.data);

        this.friends = this.friends.map((item: any) => ({
          ...item,
          users: item.users.filter((user: any) => user.id !== this.user?.id)
        }))
      }
    )
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

  addGroup(receiver_id: number, conversation_id: number) {
    // console.log(receiver_id, conversation_id);

    this.chatService.addGroup({ receiver_id, conversation_id }).subscribe(
      (response: any) => {
        // console.log(response);
      }
    )
  }

  removeMember(conversation_id: number, user_id: number) {
    this.chatService.removeMember(conversation_id, user_id).subscribe(
      (response: any) => {
        // console.log(response);
      })
  }


  toggleDialogEditGroup() {
    this.idDialogEditGroup = !this.idDialogEditGroup;
  }

  editGroup(value: any) {
    const formData = new FormData();
    formData.append('id', this.conversation.id);

    if (value.name_edit_group != '')
      formData.append('name', value.name_edit_group);

    if (this.selectedFilesEditGroup.length > 0)
      formData.append('image', this.selectedFilesEditGroup[0], this.selectedFilesEditGroup[0].name);

    this.chatService.updateGroup(formData).subscribe(
      (response: any) => {
        // console.log(response);
        this.closeEditGroup();
        this.nameEditGroup.nativeElement.value = '';

        this.conversation.name = response.data.name;
        this.conversation.image = response.data.image;
      }
    )
  }

  onFileImageGroupSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    // console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewGroupImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesGroup = [file];
  }

  onFileImageEditGroupSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    // console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewEditGroupImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesEditGroup = [file];
  }

  removeEditGroupImage(): void {
    this.previewEditGroupImages = [];
    this.selectedFilesEditGroup = [];
    if (this.fileImageEditGroup) this.fileImageEditGroup.nativeElement.value = '';
  }

  closeEditGroup() {
    this.toggleDialogEditGroup();
    this.removeEditGroupImage();
  }

  zoomMedia: any = null;

  setZoomMedia(media: any) {
    this.zoomMedia = media;
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
}
