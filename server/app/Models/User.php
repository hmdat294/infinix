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

    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'user_conversations', 'user_id', 'conversation_id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'user_id');
    }

    public function comment_likes()
    {
        return $this->hasMany(PostCommentLike::class, 'user_id');
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['profile'] = $this->profile;

        $data['permissions'] = $this->permissions;

        $data['is_friend'] = ($this->friendsOf->concat($this->friendsOfMine))->contains($this->id);

        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $this->updated_at->format('Y-m-d H:i:s');

        $data['created_at_time'] = $this->created_at->format('H:i:s');
        $data['updated_at_time'] = $this->updated_at->format('H:i:s');

        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        $data['updated_at_date'] = $this->updated_at->format('Y-m-d');

        return $data;
    }
}
