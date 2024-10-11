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

    // public function getFriends()
    // {
    //     $id_array = [];
        
    //     // Lấy các ID bạn bè trong trường 'user_id'
    //     Relationship::where('user_id', $this->id)->get()->each(function ($item) use (&$id_array) {
    //         array_push($id_array, $item->related_user_id);
    //     });
        
    //     // Lấy các ID bạn bè trong trường 'related_user_id'
    //     Relationship::where('related_user_id', $this->id)->get()->each(function ($item) use (&$id_array) {
    //         array_push($id_array, $item->user_id);
    //     });
        
    //     // Trả về danh sách user khác mà người dùng hiện tại là bạn bè
    //     return User::whereIn('id', $id_array)->where('id', '!=', $this->id)->get();
    // }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions', 'user_id', 'permission_id');
    }


    public function followings()
    {
        return $this->belongsToMany(User::class, 'relationships', 'related_user_id', 'user_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'relationships', 'user_id', 'related_user_id');
    }
}
