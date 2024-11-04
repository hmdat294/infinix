import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bookmark',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bookmark.component.html',
  styleUrl: './bookmark.component.css'
})
export class BookmarkComponent implements OnInit {

  listPost: any[] = [];

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit(): void {
    this.postService.getBookmarkByUser().subscribe(
      (data) => {
        console.log('Bookmark Post: ', data.data);
        this.listPost = data.data;
        this.listPost.reverse();
      }
    )
  }

  //bookmark

  bookmarkPost(post_id: number) {
    this.postService.bookmarkPost(post_id).subscribe(
      (response) => {
        this.listPost = this.listPost.filter(item => item.id !== post_id);
      });
  }

  //bookmark

}
