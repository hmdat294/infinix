<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostMedia as PostMediaModel;
use App\Models\PollOption;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use App\Events\UserPostEvent;
use App\Models\DisabledNotification as DisabledNotificationModel;
use App\Models\Notification;
use App\Http\Resources\PostCommentResource;
use App\Models\PostComment as CommentModel;
use App\Events\UserCommentPostEvent;

class PostController extends Controller
{

    /**
     * Danh sách bài viết
     * 
     * @return AnonymousResourceCollection
     */
    public function index()
    {
        $posts = PostModel::orderBy('created_at', 'desc')->paginate(10);

        return PostResource::collection($posts)->additional([
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ]
        ]);
    }


    /**
     * Tạo bài viết
     * @bodyParam  username       :  string  :  Tên đăng nhập
     * @bodyParam  content        :  string  :  Nội dung bài viết
     * @bodyParam  post_type      :  string  :  Loại bài viết
     * @bodyParam  medias         :  file    :  Các file phương tiện
     * 
     * @bodyParam  poll_option    :  string  :  Mảng các lựa chọn cho bài viết (nếu post_type là with_poll)
     * @bodyParam  end_at         :  date    :  Thời gian kết thúc bình chọn (nếu post_type là with_poll)
     * 
     * @return PostResource
     */
    public function store(Request $request)
    {
        $post_data = $request->only(['content', 'post_type', 'medias']);
        $post_data['user_id'] = $request->user()->id;
        $post = PostModel::create($post_data);

        if ($request->post_type === 'with_poll' && $request->has('poll_option', 'end_at')) {
            $poll = $post->poll()->create([
                'post_id' => $post->id,
                'end_at' => $request->end_at,
            ]);

            foreach ($request->poll_option as $option) {
                $poll->options()->create([
                    'poll_id' => $poll->id,
                    'option' => $option,
                ]);
            }
        }

        if ($request->hasFile('medias')) {
            foreach ($request->file('medias') as $media) {
                $media_path = $media->store('uploads', 'public');
                $media_type = $media->getMimeType();
                PostMediaModel::create([
                    'post_id' => $post->id,
                    'path' => asset('storage/' . $media_path),
                    'type' => $media_type,
                ]);
            }
        }

        event(new UserPostEvent($post->user_id, $post->id, $post->content));

        // $this->sendNotification($post);

        return new PostResource($post);
    }


    /**
     * Chi tiết bài viết
     * 
     * @param string $id Id bài viết
     * 
     * @response 200 : Thông tin chi tiết bài viết
     * @response 404 : Bài viết không tồn tại
     * 
     * @return PostResource
     */
    public function show(string $id)
    {
        if (PostModel::where('id', $id)->doesntExist()) {
            return response()->json([
                'message' => 'Post not found.',
            ], 404);
        }

        $post = PostModel::find($id);
        return new PostResource($post);
    }
    

    /**
     * Cập nhật bài viết

     * @param string $id Id bài viết
     * 
     * @bodyParam  content        :  string  : Nội dung bài viết
     * @bodyParam  post_type      :  string  : Loại bài viết
     * 
     * @return PostResource
     */
    public function update(Request $request, string $id)
    {
        $post = PostModel::find($id);
        $post->update($request->only(['content', 'post_type', 'medias']));
        if ($request->post_type === 'with_poll' && $request->has('poll_option', 'end_at')) {
            $poll = $post->poll()->update([
                'end_at' => $request->end_at,
            ]);

            foreach ($request->poll_option as $option) {
                $poll->options()->update([
                    'poll_id' => $poll->id,
                    'option' => $option,
                ]);
            }
        }
        return new PostResource($post);
    }

    /**
     * Xóa bài viết
     * 
     * @param string $id Id bài viết
     * 
     * @return JsonResponse
     */
    public function destroy(string $id)
    {
        $post = PostModel::find($id);
        $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully.',
        ], 200);
    }

    public function comments(string $id)
    {
        $post = PostModel::find($id);
        return $post->comments;
    }

    public function likes(string $id)
    {
        $post = PostModel::find($id);
        return $post->likes;
    }

    public function shares(string $id)
    {
        $post = PostModel::find($id);
        return $post->shares;
    }

    public function bookmarks(string $id)
    {
        $post = PostModel::find($id);
        return $post->bookmarks;
    }

    public function comment_post(Request $request, string $id)
    {
        $comment = CommentModel::create([
            'post_id' => $id,
            'user_id' => $request->user()->id,
            'content' => $request->input('content'),
        ]);

        event(new UserCommentPostEvent($comment->user_id, $comment->post_id, $comment->id, $comment->content));

        return new PostCommentResource($comment);
    }

    public function like_post(Request $request, string $id)
    {
        $post = PostModel::find($id);
        if ($post->likes()->where('user_id', $request->user()->id)->exists())
        {
            $post->likes()->where('user_id', $request->user()->id)->delete();
        } else {
            $post->likes()->create([
                'post_id' => $post->id,
                'user_id' => $request->user()->id,
            ]);
        }
    }

    public function share_post(Request $request, string $id)
    {
        $post = PostModel::find($id);
        if ($post->shares()->where('user_id', $request->user()->id)->exists())
        {
            $post->shares()->where('user_id', $request->user()->id)->delete();
        } else {
            $post->shares()->create([
                'post_id' => $post->id,
                'user_id' => $request->user()->id,
            ]);
        }
    }

    public function bookmark_post(Request $request, string $id)
    {
        $post = PostModel::find($id);
        if ($post->bookmarks()->where('user_id', $request->user()->id)->exists())
        {
            $post->bookmarks()->where('user_id', $request->user()->id)->delete();
        } else {
            $post->bookmarks()->create([
                'post_id' => $post->id,
                'user_id' => $request->user()->id,
            ]);
        }
    }


























    /**
     * Bình chọn cho một lựa chọn trong bài viết có poll
     * @param string $id Id của lựa chọn (poll_option)
     * 
     * @response 400 Bạn đã bình chọn cho lựa chọn này rồi
     * 
     * @return PostResource
     */
    public function vote(Request $request, string $poll_option_id)
    {
        $option = PollOption::find($poll_option_id);

        if ($option->votes()->where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'message' => 'You have already voted for this option.',
            ], 400);
        }

        $option->votes()->create([
            'poll_option_id' => $option->id,
            'user_id' => $request->user()->id,
        ]);

        return new PostResource($option->poll->post);
    }

    public function sendNotification($post)
    {
        $user = $post->user;
        $user_id = $user->id;

        $friends = $user->friendsOf->concat($user->friendsOfMine);
        $followers = $user->followers;

        $recipients = $friends->concat($followers);

        $recipient_ids = $recipients->pluck('id');

        Log::info('friends and follower ids: '.$recipient_ids);

        $disabled_notification_users = DisabledNotificationModel::whereNotIn('user_id', $recipient_ids)
            ->orWhere(function ($query) use ($user_id) {
                $query->where('target_user_id', '!=', $user_id);
            })->pluck('user_id');

        Log::info('disabled_notification_users: '.$disabled_notification_users);

        $recipients_id = $recipient_ids->diff($disabled_notification_users);

        Log::info('recipients_id: '.$recipients_id);

        $recipients = $recipients->whereIn('id', $recipients_id);

        Log::info('recipients: '.$recipients);

        foreach ($recipients as $recipient) {
            Notification::create([
                'user_id' => $recipient->id,
                'target_user_id' => $user_id,
                'post_id' => $post->id,
                'type' => 'user',
                'action_type' => 'user_create_post',
                'content' => $post->content,
            ]);
        }
    }
}
