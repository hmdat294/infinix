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
        'last_activity'
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
        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id');
    }


    public function followings()
    {
        return $this->belongsToMany(User::class, 'relationships', 'related_user_id', 'user_id')->wherePivot('type', 'follow');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'relationships', 'user_id', 'related_user_id')->wherePivot('type', 'follow');
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
        return $this->belongsToMany(User::class, 'reports', 'sender_id', 'user_id');
    }
}
