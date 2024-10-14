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

class PostController extends Controller
{

    /**
     * Danh sách bài viết
     * 
     * @param string $user_id : Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function index(string $user_id = null)
    {
        if ($user_id) {
            $posts = PostModel::where('user_id', $user_id)->orderBy('created_at', 'desc')->paginate(10);
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

        broadcast(new UserPostEvent($post->user_id, $post->id, $post->content))->toOthers();

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
}
