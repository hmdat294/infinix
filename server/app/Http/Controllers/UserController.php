<?php

namespace App\Http\Controllers;

use App\Events\UserFollowUserEvent;
use App\Http\Resources\PostMediaResource;
use App\Http\Resources\UserResource;
use App\Models\Profile as ProfileModel;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Events\UserConnectionEvent;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\ReportResource;
use App\Events\UserBlockUserEvent;
use App\Models\BlockedUser;

class UserController extends Controller
{
    /**
     * Danh sách người dùng
     * 
     * @return AnonymousResourceCollection
     */
    // public function index()
    // {
    //     if (request()->has('search')) {
    //         $users = UserModel::whereHas('profile', function ($query) {
    //             $query->where('display_name', 'like', '%' . request('search') . '%');
    //         })->get();
    //         return UserResource::collection($users);
    //     }

    //     $users = UserModel::paginate(10);
    //     return UserResource::collection($users)->additional([
    //         'meta' => [
    //             'current_page' => $users->currentPage(),
    //             'last_page' => $users->lastPage(),
    //             'per_page' => $users->perPage(),
    //             'total' => $users->total(),
    //         ]
    //     ]);
    // }
    public function index()
    {
        $users = UserModel::all();
        return UserResource::collection($users);
    }

    /**
     * Hiển thị thông tin người dùng
     * 
     * @param string $id : Id người dùng, mặc định là người dùng hiện tại đang đăng nhập nếu không truyền id
     * 
     * @return UserResource
     */
    public function show($id = 0)
    {
        return new UserResource(UserModel::find($id == 0 ? request()->user()->id : $id));
    }

    public function update(Request $request)
    {
        Log::info($request->all());
        $user = UserModel::find($request->user()->id);
        $user->update($request->only(['username', 'email', 'password', 'theme', 'language', 'phone_number', 'accept_stranger_message']));
        $user->profile->update($request->only(['display_name', 'biography', 'date_of_birth', 'address', 'gender']));

        if ($request->has('profile_photo')) {
            $path = $request->file('profile_photo')->store('uploads', 'public');
            $user->profile->update(['profile_photo' => asset('storage/' . $path)]);
        }

        if ($request->has('cover_photo')) {
            $path = $request->file('cover_photo')->store('uploads', 'public');
            $user->profile->update(['cover_photo' => asset('storage/' . $path)]);
        }

        return new UserResource($user);
    }

    public function medias($user_id = 0)
    {
        $user = UserModel::find($user_id == 0 ? request()->user()->id : $user_id);
        // tổng hợp tất cả post_medias của tất cả post của user
        $medias = $user->posts->map(function ($post) {
            return $post->medias;
        })->flatten();

        return PostMediaResource::collection($medias);
    }

    public function updateOnlineStatus(Request $request)
    {
        // Log::info($request->json()->all());
        
        $data = $request->json()->all();

        $user = UserModel::find($data['user_id']);
        $user->update(['online_status' => $data['online_status']]);

        event(new UserConnectionEvent($user,  $data['online_status']));

        return new UserResource($user);
    }

    public function bookmarks(Request $request)
    {
        $user = UserModel::find($request->user()->id);
        if (isset($user->bookmarks)) {
            Log::info($user->bookmarks);
            return PostResource::collection($user->bookmarks);
        }
    }

    public function follow(Request $request, $user_id)
    {
        $user = UserModel::find($user_id);

        if ($request->user()->followings->contains($user)) {
            $request->user()->followings->detach($user);
            event(new UserFollowUserEvent($request->user()->id, $user_id, "unfollow"));
        } else {
            $request->user()->followings()->attach($user);
            event(new UserFollowUserEvent($request->user()->id, $user_id, "follow"));
        }

        
        return new UserResource($user);
    }

    public function unfollow(Request $request, $user_id)
    {
        $user = UserModel::find($user_id);
        $request->user()->followings()->detach($user);
        return new UserResource($user);
    }

    public function unfriend(Request $request, $user_id)
    {
        $user = UserModel::find($user_id);
        $request->user()->friendsOfMine()->detach($user);
        $request->user()->friendsOf()->detach($user);
        return new UserResource($user);
    }

    public function block(Request $request, $user_id)
    {
        $user = UserModel::find($user_id);

        if ($request->user()->blockings->contains($user)) {
            BlockedUser::where('blocker_id', $request->user()->id)->where('blocked_id', $user->id)->delete();
            event(new UserBlockUserEvent($request->user(), $user, 'unblock'));
        } else {
            BlockedUser::create([
                'blocker_id' => $request->user()->id,
                'blocked_id' => $user->id,
            ]);
            event(new UserBlockUserEvent($request->user(), $user, 'block'));
        }
        return new UserResource($user);
    }

    public function blockedUsers(Request $request, $user_id = 0)
    {
        $user = UserModel::find($user_id == 0 ? request()->user()->id : $user_id);
        return UserResource::collection($user->blockings);
    }

    public function blockedByUsers(Request $request, $user_id = 0)
    {
        $user = UserModel::find($user_id == 0 ? request()->user()->id : $user_id);
        return UserResource::collection($user->blockedBy);
    }

    public function reported(Request $request)
    {
        $user = UserModel::find($request->user()->id);
        return ReportResource::collection($user->reportings);
    }

    public function friendSuggestions(Request $request)
    {

        $user = UserModel::find($request->user()->id);
        Log::info("user_id: " . $user->id);

        $friends = $user->friendsOf->concat($request->user()->friendsOfMine);
        Log::info("firends: " . $friends->pluck('id'));

        $friends_of_friend_ids = $friends->map(function ($friend) {
            return $friend->friendsOf->concat($friend->friendsOfMine);
        })->flatten()->pluck('id');
        Log::info("friends_of_friend_ids: " . $friends_of_friend_ids);

        $friends_of_friend_ids = $friends_of_friend_ids->diff($friends->pluck('id'));
        $friends_of_friend_ids = $friends_of_friend_ids->diff([$user->id]);
        Log::info("friends_of_friend_ids: " . $friends_of_friend_ids);

        $blocking_user_ids = $user->blockings->pluck('blocked_id');
        Log::info("blocking_user_ids: " . $blocking_user_ids);

        $blocked_by_user_ids = $user->blockedBy->pluck('blocker_id');
        Log::info("blocked_by_user_ids: " . $blocked_by_user_ids);

        $reporting_user_ids = $user->reportings->pluck('user_id');
        Log::info("reporting_user_ids: " . $reporting_user_ids);

        $friend_suggestions = UserModel::
              whereIn('id', $friends_of_friend_ids)
            ->whereNotIn('id', $blocking_user_ids)
            ->whereNotIn('id', $blocked_by_user_ids)
            ->whereNotIn('id', $reporting_user_ids);

        $more_friends = null;

        // if size < 5, get more 5 random friends who are not in the list and not is friend of user
        if ($friend_suggestions->count() < 10) {
            $more_friends = UserModel::
                whereNotIn('id', $friends->pluck('id'))
                ->whereNotIn('id', $friend_suggestions->pluck('id'))
                ->where('id', '<>', $user->id)
                ->inRandomOrder()
                ->limit(10 - $friend_suggestions->count())
                ->get();
        }
        
            
        $friend_suggestions = $friend_suggestions->get()->concat($more_friends);
        Log::info("friend_suggestions: " . $friend_suggestions->pluck('id'));
        return UserResource::collection($friend_suggestions);




        // $friends = $user->friendsOf->concat($request->user()->friendsOfMine)->pluck('id');

        // $blockings = $user->blockings->pluck('blocked_id');
        // $blockedBy = $user->blockedBy->pluck('blocker_id');
        // $reportings = $user->reportings->pluck('user_id');
        
        // $friends = UserModel::whereNotIn('id', $friends)
        //     ->whereNotIn('id', $blockings)
        //     ->whereNotIn('id', $blockedBy)
        //     ->whereNotIn('id', $reportings);

        // $friends_of_friends = $friends->get()->map(function ($friend) {
        //     return $friend->friendsOf->concat($friend->friendsOfMine);
        // })->flatten()->pluck('id');

        // $friend_ids = $friends->pluck('id');

        // // loại ra bạn bè từ danh sách bạn của bạn bè
        // $friends_of_friends = $friends_of_friends->diff($friend_ids);


        // $friendSuggetions = UserModel::whereIn('id', $friends_of_friends)->get();

        // return UserResource::collection($friendSuggetions);
    }
}
