<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\Profile as ProfileModel;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Danh sách người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function index()
    {  
        $users = UserModel::paginate(10);

        return UserResource::collection($users)->additional([
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }


    /**
     * Hiển thị thông tin người dùng
     * 
     *  @param string $id  Id người dùng
     * 
     * @return UserResource
     */
    public function show(string $id)
    {
        return new UserResource(UserModel::find($id));
    }


    /**
     * Cập nhật thông tin người dùng
     * 
     *  @param string $id  Id người dùng
     * 
     * @bodyParam  username       :  string  :  Tên đăng nhập
     * @bodyParam  email          :  string  :  Email
     * @bodyParam  password       :  string  :  Mật khẩu
     * @bodyParam  phone_number   :  string  :  Số điện thoại
     * @bodyParam  language       :  string  :  Ngôn ngữ ["vi", "en"]
     * @bodyParam  theme          :  string  :  Giao diện ["light", "dark", "turquoise"]
     * 
     * @bodyParam  display_name   :  string  :  Tên hiển thị
     * @bodyParam  profile_photo  :  string  :  Ảnh đại diện
     * @bodyParam  cover_photo    :  string  :  Ảnh bìa
     * @bodyParam  biography      :  string  :  Tiểu sử
     * @bodyParam  date_of_birth  :  date    :  Ngày sinh
     * @bodyParam  address        :  string  :  Địa chỉ
     * @bodyParam  gender         :  string  :  Giới tính ["male", "female", "other"]
     * 
     * 
     * @return UserResource
     */
    public function update(Request $request, $id)
    {
        $user = UserModel::find($id);
        $user->update($request->only(['username', 'email', 'password', 'phone_number', 'language', 'theme']));
        $user->profile()->update($request->only(['display_name', 'profile_photo', 'cover_photo', 'biography', 'date_of_birth', 'address', 'gender']));

        return new UserResource($user);
    }

    
    /**
     * Xóa người dùng
     * 
     * @param string $id  Id người dùng
     * 
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $user = UserModel::find($id);
        $user->delete();

        return response()->json(['message' => 'Xóa người dùng thành công']);
    }


    /**
     * Tìm kiếm người dùng
     * 
     * @queryParam keyword        :  string  :  Từ khóa tìm kiếm
     * 
     * @return AnonymousResourceCollection
     */
    public function search(Request $request)
    {
        $user_query = UserModel::query();

        if($request->has('keyword')) {
            $user_query->whereHas('profile', function ($query) use ($request) {
                $query->where('display_name', 'like', '%' . $request->keyword . '%');
            });
        } 

        $users = $user_query->paginate(10);

        return UserResource::collection($users)->additional([
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }


    /**
     * Thông tin người dùng hiện tại
     * 
     * @return UserResource
     */
    public function self(Request $request)
    {
        return new UserResource($request->user());
    }

    
    /**
     * Danh sách bạn bè
     * 
     *  @param string $id  Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function friends($id)
    {
        $user = UserModel::find($id);
        $friends = $user->friendsOf->concat($user->friendsOfMine);

        return UserResource::collection($friends);
    }


    /**
     * Danh sách người theo dõi
     * 
     *  @param string $id  Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function followers($id)
    {
        $user = UserModel::find($id);
        $followers = $user->followers;

        return UserResource::collection($followers);
    }


    /**
     * Danh sách người đang theo dõi
     * 
     *  @param string $id  Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function following($id)
    {
        $user = UserModel::find($id);
        $following = $user->following;

        return UserResource::collection($following);
    }


    /**
     * Danh sách bài đăng của người dùng
     * 
     *  @param string $id  Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function posts($id)
    {
        $user = UserModel::find($id);
        $posts = $user->posts;

        return PostResource::collection($posts);
    }


    /**
     * Danh sách cuộc hội thoại của người dùng
     * 
     *  @param string $id  Id người dùng
     * 
     * @return AnonymousResourceCollection
     */
    public function conversations($id)
    {
        $user = UserModel::find($id);
        $conversations = $user->conversations;

        return ConversationResource::collection($conversations);
    }

    // Todo VoteResource
    public function votes($id)
    {
        $user = UserModel::find($id);
        $votes = $user->votes;

        return $votes;
    }
}
