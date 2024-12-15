<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'phone_number',
        'password',
        'status',
        'online_status',
        'language',
        'theme',
        'last_activity',
        'accept_stranger_message'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function friendsOf()
    {
        return $this->belongsToMany(User::class, 'relationships', 'user_id', 'related_user_id')->wherePivot('type', 'friend');
    }

    public function friendsOfMine()
    {
        return $this->belongsToMany(User::class, 'relationships', 'related_user_id', 'user_id')->wherePivot('type', 'friend');
    }

    // public function friends()
    // {
    //     return $this->friendsOf()->wherePivot('type', 'friend')->get()->merge($this->friendsOfMine()->wherePivot('type', 'friend')->get());
    // }


    public function permissions()
    {
        $user_permissions = UserPermission::where('user_id', $this->user_id)->get();
        foreach ($user_permissions as $user_permission) {
            if ($user_permission->enable_at < now()) {
                $user_permission->is_active = true;
                $user_permission->enable_at = null;
                $user_permission->save();
            }
        }

        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id')->withPivot('is_active', 'enable_at');
    }


    public function followings()
    {
        return $this->belongsToMany(User::class, 'relationships', 'user_id', 'related_user_id')->wherePivot('type', 'follow');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'relationships', 'related_user_id', 'user_id')->wherePivot('type', 'follow');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id');
    }

    public function bookmarks()
    {
        return $this->belongsToMany(Post::class, 'post_bookmarks', 'user_id', 'post_id');
    }

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'user_conversations', 'user_id', 'conversation_id');
    }

    public function friendRequest()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function blockings()
    {
        return $this->belongsToMany(User::class, 'blocked_users', 'blocker_id', 'blocked_id');
    }

    public function blockedBy()
    {
        return $this->belongsToMany(User::class, 'blocked_users', 'blocked_id', 'blocker_id');
    }

    public function reportings()
    {
        return $this->hasMany(Report::class, 'sender_id');
    }

    public function deletedMessages()
    {
        return $this->hasMany(DeletedMessage::class, 'user_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class, 'user_id');
    }

    public function shop()
    {
        return $this->hasOne(Shop::class, 'user_id');
    }

    public function vouchers()
    {
        return $this->belongsToMany(Voucher::class, 'voucher_users', 'user_id', 'voucher_id');
    }
}
