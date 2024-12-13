import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PostService } from '../../service/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import moment from 'moment';
import { AuthService } from '../../service/auth.service';
import { CarouselService } from '../../service/carousel.service';
import { EventService } from '../../service/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { QuillModule } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { LeftProfileComponent } from "../left-profile/left-profile.component";

@Component({
    selector: 'app-center-profile',
    imports: [FormsModule, CommonModule, RouterModule, EmojiModule, PickerComponent, QuillModule, TranslateModule, LeftProfileComponent],
    templateUrl: './center-profile.component.html',
    styleUrl: './center-profile.component.css'
})
export class CenterProfileComponent implements OnInit, AfterViewInit {

  content: string = '';
  contentUpdate: string = '';
  selectedFilesPost: File[] = [];
  selectedFilesUpdatePost: File[] = [];
  previewPostImages: any[] = [];
  previewUpdatePostImages: any[] = [];
  selectedFilesComment: File[] = [];
  previewCommentImages: string[] = [];
  listPost: any[] = [];
  filePost: any;
  fileUpdatePost: any;
  fileComment: any;
  showPoll: boolean = false;
  poll_input: any[] = [];
  spaceCheck: any = /^\s*$/;
  idDialog: number = 0;
  commentByPostId: any[] = [];
  currentUser: any;
  listUser: any;
  listGroup: any;
  contentCommentInput: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private carouselService: CarouselService,
    private eventService: EventService,
    private authService: AuthService,
    private chatService: ChatService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.authService.getUser(0).subscribe(
      (data) => {
        this.currentUser = data.data;
      });

    this.chatService.getListChat().subscribe(
      (response) => {
        this.listUser = response.data.filter((item: any) => item.is_group == 0);
        this.listGroup = response.data.filter((item: any) => item.is_group == 1);
      });

    this.postService.getPostByUser().subscribe(
      (data) => {
        this.listPost = data.data;
        // console.log(this.listPost);

        this.eventService.bindEvent('App\\Events\\UserPostEvent', (data: any) => {
          // console.log('Post event:', data);
          if (data.action == "create") {
            this.listPost.unshift(data.data);
          } else {
            const index = this.listPost.findIndex((post: any) => post.id === data.data.id);
            if (index !== -1) this.listPost[index] = data.data;
          }

        });
      });
  }

  @ViewChildren('carouselInner') carouselInners!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('nextButton') nextButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('prevButton') prevButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChildren('indicatorsContainer') indicatorsContainers!: QueryList<ElementRef<HTMLDivElement>>;

  isSlidingSlide: boolean = false;

  nextuser(value: string) {
    if (this.isSlidingSlide) return;

    const slideShare = document.querySelector<HTMLDivElement>(`.${value}_inner`);
    const shareItems = document.querySelectorAll<HTMLDivElement>(`.${value}_item`);

    if (slideShare && shareItems.length > 4) {
      this.isSlidingSlide = true;

      const first = shareItems[0];

      slideShare.style.transition = 'transform 0.3s ease-in-out';
      slideShare.style.transform = `translateX(-${shareItems[0].offsetWidth + 20}px)`;

      setTimeout(() => {
        slideShare.style.transition = 'none';
        slideShare.style.transform = 'translateX(0)';

        slideShare.appendChild(first);

        this.isSlidingSlide = false;
      }, 300);
    }
  }

  prevuser(value: string) {
    if (this.isSlidingSlide) return;

    const slideShare = document.querySelector<HTMLDivElement>(`.${value}_inner`);
    const shareItems = document.querySelectorAll<HTMLDivElement>(`.${value}_item`);

    if (slideShare && shareItems.length > 4) {
      this.isSlidingSlide = true;

      const last = shareItems[shareItems.length - 1];

      slideShare.insertBefore(last, shareItems[0]);

      slideShare.style.transition = 'none';
      slideShare.style.transform = `translateX(-${shareItems[0].offsetWidth + 20}px)`;

      setTimeout(() => {
        slideShare.style.transition = 'transform 0.3s ease-in-out';
        slideShare.style.transform = 'translateX(0)';
      }, 0);

      setTimeout(() => {
        this.isSlidingSlide = false;
      }, 300);
    }
  }

  ngAfterViewInit(): void {
    this.initCarousels();
  }

  initCarousels(): void {
    const posts = this.listPost.filter((item: any) => item.post_type === "with_media");

    this.carouselInners.forEach((carouselInner, index) => {
      const nextButton = this.nextButtons.toArray()[index];
      const prevButton = this.prevButtons.toArray()[index];
      const indicators = this.indicatorsContainers.toArray()[index].nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

      this.carouselService.initCarousel(posts[index].id, carouselInner, nextButton, prevButton, indicators);
    });
  }

  goSlide(postId: number, slideIndex: number): void {
    this.carouselService.goSlide(postId, slideIndex);
  }

  toggleDialog(post_id: number, slideIndex: number = 0) {
    this.idDialog = post_id;
    this.eventService.setPostId(post_id);

    if (this.idDialog == 0) {
      this.commentByPostId[post_id] = null;
    }
    else {
      this.postService.getComment(post_id).subscribe(
        (response) => {

          this.commentByPostId[post_id] = response.data;
          this.goSlide(post_id, slideIndex)

          this.eventService.bindEventPost('App\\Events\\UserCommentPostEvent', (data: any) => {
            this.listPost.find(item => item.id === data.data.post.id).comments_count = data.comments_count;
            this.getCommentByPostId(data.data.post.id).unshift(data.data);
            // console.log('Comment event:', data);
          });

          this.eventService.bindEventPost('App\\Events\\UserLikePostEvent', (data: any) => {
            this.listPost.find(item => item.id === data.data.id).likes_count = data.likes_count;
            // console.log('Like event:', data);
          });

        })
    }

    this.cdr.detectChanges();
    this.initCarousels();
  }


  getCommentByPostId(post_id: number) {
    return this.commentByPostId[post_id];
  }

  getPathImg(img: any) {
    return { 'path': img.path, 'type': img.type };
  }

  post(value: any) {

    if (value.content && !this.spaceCheck.test(value.content)) {
      const formData = new FormData();
      formData.append('content', value.content);

      if (this.selectedFilesPost.length > 0)
        this.selectedFilesPost.forEach(image => formData.append('medias[]', image, image.name));

      if (this.poll_input.length > 0) {
        formData.append('end_at', value.end_at);
        formData.append('post_type', 'with_poll');
        this.poll_input.forEach(option => formData.append('poll_option[]', option));
      }

      this.postService.postPost(formData).subscribe(
        (response) => {
          this.content = '';
          this.poll_input = [];
          this.showPoll = false;
          this.onCancelPostImg();
          // console.log(response);
        });
    }
  }


  postDeleteId: number = 0;

  setDeleteId(post_id: number) {
    this.postDeleteId = post_id;
  }

  deletePost() {
    this.postService.deletePost(this.postDeleteId).subscribe(
      (response) => {
        // console.log(response);
      }
    );
  }

  updatePost(value: any) {
    const urlImg = this.previewUpdatePostImages.filter(url => url.startsWith("http"));

    if (value.contentUpdate && !this.spaceCheck.test(value.contentUpdate)) {
      const formData = new FormData();
      formData.append('content', value.contentUpdate);

      if (this.selectedFilesUpdatePost.length > 0)
        this.selectedFilesUpdatePost.forEach(image => formData.append('medias[]', image, image.name));

      if (urlImg.length > 0) {
        urlImg.forEach(imagePath => {
          const data = {
            path: imagePath.path,
            type: imagePath.type
          };
          formData.append('urls[]', JSON.stringify(data));
        });
      }

      this.postService.updatePost(this.postUpdateId, formData).subscribe(
        (response) => {
          // console.log(response);
          this.showDiaLogUpdatePost(null);
        },
        (error) => {
          console.error("Error updating post:", error);
        }
      );
    }
  }


  postUpdateId: number = 0;

  showDiaLogUpdatePost(post: any) {
    if (post == null) {
      this.postUpdateId = 0;
      this.onCancelUpdatePostImg();
    }
    else {
      this.postUpdateId = post.id;
      this.previewUpdatePostImages = [...post.medias];
      this.contentUpdate = post.content;
    }
  }

  onFileUpdatePostSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
          // Xử lý ảnh
          reader.onload = () => this.previewUpdatePostImages.push({ type: 'image/webp', path: reader.result as string });
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          // Xử lý video
          const videoURL = URL.createObjectURL(file);
          this.previewUpdatePostImages.push({ type: 'video/mp4', path: videoURL });
        }

        // Lưu tệp vào danh sách đã chọn
        this.selectedFilesUpdatePost.push(file);
      });
    }
  }

  removeUpdatePostImage(index: number): void {
    this.previewUpdatePostImages.splice(index, 1);
    this.selectedFilesUpdatePost.splice(index, 1);
  }

  onCancelUpdatePostImg() {
    this.contentUpdate = '';
    this.selectedFilesUpdatePost = [];
    this.previewUpdatePostImages = [];
    if (this.fileUpdatePost) this.fileUpdatePost.nativeElement.value = '';
  }


  changeHtmlContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  editorModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['clean'],
      // ['link', 'image', 'video']
    ]
  };

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


  showEmojiPickerComment: boolean = false;

  toggleEmojiPickerComment() {
    this.showEmojiPickerComment = !this.showEmojiPickerComment;
  }

  addEmojiComment(event: any) {
    this.contentCommentInput += event.emoji.native;
  }


  showEmojiPickerUpdate: boolean = false;

  toggleEmojiPickerUpdate() {
    this.showEmojiPickerUpdate = !this.showEmojiPickerUpdate;
  }

  addEmojiUpdate(event: any) {
    this.contentUpdate += event.emoji.native;
  }


  postComment(value: any) {
    console.log(value);

    const formData = new FormData();
    formData.append('content', value.content);
    formData.append('post_id', value.post_id);
    formData.append('user_id', value.user_id);

    if (this.selectedFilesComment.length > 0)
      formData.append('media', this.selectedFilesComment[0], this.selectedFilesComment[0].name);

    this.postService.postComment(formData).subscribe(
      (response) => {
        // console.log(response);
        this.contentCommentInput = '';
        this.removeCommentImage();
      }
    )
  }

  likePost(post_id: number) {
    this.postService.likePost(post_id).subscribe(
      (response) => {
        const post = this.listPost.find(item => item.id === post_id);
        if (response.liked) post.likes_count++;
        else post.likes_count--;
        post.liked = response.liked;

        // console.log(response);
      }
    )
  }

  //like comment
  likeComment(comment_id: number, post_id: number) {
    this.postService.postLikeComment(comment_id).subscribe(
      (response: any) => {
        // console.log(response);
        const comment = this.commentByPostId[post_id].find((item: any) => item.id == comment_id);
        comment.liked = !comment.liked;
        (response.type == 'like') ? comment.like_count++ : comment.like_count--;
      })
  }
  //like comment

  //bookmark

  bookmarkPost(post_id: number) {
    this.postService.bookmarkPost(post_id).subscribe(
      (response) => {
        // console.log(response);

        const bookmark = this.listPost.find(item => item.id === post_id);
        bookmark.bookmarked = !bookmark.bookmarked;
      });
  }

  //bookmark

  //share

  dialogShare: number = 0;
  shareSuccess: string = '';

  showShare(post_id: number) {
    this.dialogShare = post_id;
    this.shareSuccess = '';
  }

  copyUrl(post_id: number) {
    const postShare = this.listPost.find((item: any) => item.id == post_id);

    navigator.clipboard.writeText(`${window.location.origin}/friend-profile/${postShare.profile.id}/${post_id}`)
      .then(() => {
        this.shareSuccess =
          `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
            <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
            <span>Đã sao chép đường dẫn vào bộ nhớ tạm!</span>
          </p>`;
      })
      .catch((error) => {
        this.shareSuccess =
          `<p class="validation-message validation-critical text-body text-primary py-10 px-15">
            <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
            <span>Sao chép không thành công!</span>
          </p>`;
      });
  }

  sharePostToMessage(post_id: number, conversation_id: number, username: string) {

    const postShare = this.listPost.find((item: any) => item.id == post_id);

    const formData = new FormData();
    formData.append('conversation_id', conversation_id.toString());
    formData.append('content', postShare.content);
    formData.append('link', `/friend-profile/${postShare.profile.id}/${post_id}`);

    if (postShare.post_type == "with_media") {
      formData.append('medias', postShare.medias[0].path);
      formData.append('type', postShare.medias[0].type);
    }

    this.chatService.sendMessage(formData).subscribe(
      (response: any) => {
        // console.log(response);
        this.shareSuccess =
          `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
            <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
            <span>Bạn đã chia sẽ đến ${username}!</span>
          </p>`;
      }
    );
  }

  sharePostToMyPage(post_id: number) {
    this.postService.sharePostToMyPage(post_id).subscribe(
      (response: any) => {
        // console.log(response);

        const shared = this.listPost.find(item => item.id === post_id);
        shared.shared = !shared.shared;
        shared.shared_by.unshift(this.currentUser);

        if (shared.shared) {
          shared.shares_count++;
          this.shareSuccess =
            `<p class="validation-message validation-sucess text-body text-primary py-10 px-15">
              <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
              <span>Bạn đã chia sẽ đến trang cá nhân của mình!</span>
            </p>`
        }
        else {
          shared.shares_count--;
          this.shareSuccess =
            `<p class="validation-message validation-critical text-body text-primary py-10 px-15">
              <i class="icon-size-16 icon icon-ic_fluent_dismiss_circle_16_filled"></i>
              <span>Bạn đã hủy chia sẽ bài viết này!</span>
            </p>`;
        }
      }
    )
  }

  //share

  //report

  diaLogReport: number = 0;
  valueReport: string[] = [];
  contentReport: string = '';
  messageReport: string = '';
  @ViewChild('checkboxesContainer') checkboxesContainer!: ElementRef;

  showDialogReport(id: any) {

    this.diaLogReport = id;
    if (this.diaLogReport == 0) {
      this.valueReport = [];
      this.contentReport = '';
      this.messageReport = '';

      this.checkboxesContainer.nativeElement.querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox: HTMLInputElement) => checkbox.checked = false);
    }
  }

  onCheckboxChange(event: any) {
    const checkboxValue = event.target.value;

    if (event.target.checked) this.valueReport.push(checkboxValue);
    else this.valueReport = this.valueReport.filter(value => value !== checkboxValue);
  }

  listIdReport: any[] = [];

  postReport(value: any): any {

    const valueReport = this.valueReport.join(', ');
    let content = '';

    if (valueReport != '' && value.contentReport != '') content = [valueReport, value.contentReport].join(', ');
    else if (valueReport != '') content = valueReport;
    else if (value.contentReport != '') content = value.contentReport;
    else return false;

    content = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase() + '.';

    const postReport: any = this.diaLogReport;
    postReport.content = content;

    console.log(postReport);


    this.postService.postReport(postReport).subscribe(
      (response: any) => {
        // console.log(response);

        if (response.data.type == 'post') {
          this.listIdReport.push({ id: response.data.id, post_id: response.data.post_id });
        }

        this.messageReport =
          `<p class="validation-message validation-sucess text-body text-primary pt-15 px-20">
              <i class="icon-size-16 icon icon-ic_fluent_checkmark_circle_16_filled"></i>
              <span>Gửi báo cáo thành công.</span>
          </p>`;
        this.showDialogReport(0);
      })

  }

  cancelReport(post_id: number) {
    const report = this.listIdReport.find((item: any) => item.post_id === post_id);
    this.postService.cancelReport(report.id).subscribe(
      (response: any) => {
        this.listIdReport = this.listIdReport.filter((id: any) => id.id !== report.id);
        // console.log(this.listIdReport);
      });
  }

  isPostIdExist(post_id: number): boolean {
    return this.listIdReport.some((item: any) => item.post_id === post_id);
  }

  //report

  showPolls() {
    this.showPoll = (this.showPoll == false) ? true : false;
    this.poll_input = [];
  }

  addChoice(): void {
    this.poll_input.push('');
  }

  removeChoice(index: number): void {
    this.poll_input.splice(index, 1);
  }

  trackByFn(index: number, item: string) {
    return index;
  }

  onFilePostSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (files && files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
          // Xử lý ảnh
          reader.onload = () => this.previewPostImages.push({ type: 'image/webp', path: reader.result as string });
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
          // Xử lý video
          const videoURL = URL.createObjectURL(file);
          this.previewPostImages.push({ type: 'video/mp4', path: videoURL });
        }

        // Lưu tệp vào danh sách đã chọn
        this.selectedFilesPost.push(file);
      });
    }
  }

  onFileCommentSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    console.log(files);

    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => this.previewCommentImages = [reader.result as string];
    reader.readAsDataURL(file);
    this.selectedFilesComment = [file];
  }

  onCancelPostImg() {
    this.selectedFilesPost = [];
    this.previewPostImages = [];
    if (this.filePost) this.filePost.nativeElement.value = '';
  }

  removePostImage(index: number): void {
    this.previewPostImages.splice(index, 1);
    this.selectedFilesPost.splice(index, 1);
  }

  removeCommentImage(): void {
    this.previewCommentImages = [];
    this.selectedFilesComment = [];
    if (this.fileComment) this.fileComment.nativeElement.value = '';
  }

  formatTime(dateString: string): string {
    const givenTime = moment(dateString);
    const currentTime = moment();
    const diffInHours = currentTime.diff(givenTime, 'hours');
    const diffInMinutes = currentTime.diff(givenTime, 'minutes');

    if (diffInHours >= 12) return givenTime.format('YYYY-MM-DD');
    else if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    else return `${diffInHours} giờ trước`;
  }

  // Cập nhật height cho textarea theo content, quá 110px thì thành cuộn dọc
  resizeTextarea(event: any): void {
    const textarea = event.target;
    if (textarea.scrollHeight < 110) {
      textarea.style.height = 'fit-content';
      textarea.style.height = textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '110px';
      textarea.style.overflowY = 'auto';
    }
  }
}
