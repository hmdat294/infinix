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
use App\Models\PostShare;
use App\Models\Report;
use App\Models\User as UserModel;

class PostController extends Controller
{

    /**
     * Danh sách bài viết
     * 
     * @param string $user_id : Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request, string $user_id = null)
    {
        if ($user_id != null) {
            if ($user_id == 0) {
                $posts = PostModel::where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->paginate(10);
            } else {
                $posts = PostModel::where('user_id', $user_id)->orderBy('created_at', 'desc')->paginate(10);
            }
            
        } else {
            $posts = PostModel::orderBy('created_at', 'desc')->paginate(10);
        }
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
     * 
     * @param Request $request
     * 
     * @bodyParam content : Nội dung bài viết
     * @bodyParam post_type : Loại bài viết
     * @bodyParam medias : Các file phương tiện
     * 
     * @bodyParam poll_option : Mảng các lựa chọn cho bài viết (nếu post_type là with_poll)
     * @bodyParam end_at : Thời gian kết thúc bình chọn (nếu post_type là with_poll)
     * 
     * @return PostResource
     */
    public function store(Request $request)
    {
        $post_data = $request->only(['content', 'post_type', 'medias']);
        $post_data['user_id'] = $request->user()->id;
        $post = PostModel::create($post_data);

        if ($request->post_type === 'with_poll' && $request->has('poll_option', 'end_at')) {
            $post->update([
                'post_type' => 'with_poll',
            ]);
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
            $post->update([
                'post_type' => 'with_media',
            ]);
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

        $this->sendNotification($post);

        return new PostResource($post);
    }


    /**
     * Chi tiết bài viết
     * 
     * @param string $id
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
     * 
     * @param Request $request
     * @param string $id
     * 
     * @bodyParam content : Nội dung bài viết
     * @bodyParam post_type : Loại bài viết
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
     * @param string $id
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

    /**
     * Danh sách bài viết theo người dùng
     * 
     * @param string $user
     * 
     * @return AnonymousResourceCollection
     */
    public function by_user_id(string $user_id)
    {
        $posts = PostModel::where('user_id', $user_id)->orderBy('created_at', 'desc')->paginate(10);
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
     * Bình chọn cho một lựa chọn trong bài viết có poll
     * 
     * @param Request $request
     * @param string $id : Id của lựa chọn (poll_option)
     * 
     * @response 400 : Bạn đã bình chọn cho lựa chọn này rồi
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

        $disabled_notification_users = DisabledNotificationModel::where('target_user_id', $user_id)->pluck('user_id');

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
                'action_type' => 'user_create_post',
                'content' => $user->profile->display_name . ' đã đăng một bài viết mới',
            ]);
        }
    }

    public function getHomePost(Request $request)
    {
        $post_ids = PostModel::where('user_id', $request->user()->id)->pluck('id');
        Log::info('post_ids: '.$post_ids);

        $shared_post_ids = PostShare::where('user_id', $request->user()->id)->pluck('post_id');
        Log::info('shared_post_ids: '.$shared_post_ids);

        $friend_ids = $request->user()->friendsOf->concat($request->user()->friendsOfMine)->pluck('id');
        $friend_post_ids = PostModel::whereIn('user_id', $friend_ids)->pluck('id');
        Log::info('friend_post_ids: '.$friend_post_ids);

        $followings_post_ids = PostModel::whereIn('user_id', $request->user()->followings->pluck('id'))->pluck('id');
        Log::info('followings_post_ids: '.$followings_post_ids);

        $reported_post_ids = Report::where('sender_id', $request->user()->id)->where('type', 'post')->pluck('post_id');
        Log::info('reported_post_ids: '.$reported_post_ids);

        $blocked_users = $request->user()->blockings;
        $blocked_user_post_ids = PostModel::whereIn('user_id', $blocked_users->pluck('id'))->pluck('id');
        Log::info('blocked_user_post_ids: '.$blocked_user_post_ids);

        $posts = PostModel::whereIn('id', $post_ids)
        ->orWhereIn('id', $shared_post_ids)
        ->orWhereIn('id', $friend_post_ids)
        ->orWhereIn('id', $followings_post_ids)
        ->whereNotIn('id', $reported_post_ids)
        ->whereNotIn('id', $blocked_user_post_ids);
        
        Log::info('post_ids: '.$posts->pluck('id'));

        $posts = $posts->get();
        foreach ($posts as &$post) {
            if ($shared_post_ids->contains($post->id)) {
               $post["created_at"] = PostShare::where('post_id', $post->id)->first()->created_at;
            }
        }

        //sort by created_at
        $posts = $posts->sortByDesc('created_at');

        return PostResource::collection($posts);
    }

    public function getProfilePost(Request $request, $user_id = null)
    {
        $user = $user_id == null ? $request->user() : UserModel::find($user_id);
        $user_id = $user->id;

        $post_ids = PostModel::where('user_id', $user_id)->pluck('id');
        Log::info('post_ids: '.$post_ids);

        $shared_post_ids = PostShare::where('user_id', $user_id)->pluck('post_id');
        Log::info('shared_post_ids: '.$shared_post_ids);



        $posts = PostModel::whereIn('id', $post_ids)
        ->orWhereIn('id', $shared_post_ids)
        ->orderBy('created_at', 'desc');
        Log::info('post_ids: '.$posts->pluck('id'));

        $posts = $posts->get();
        return PostResource::collection($posts);
    }
}
