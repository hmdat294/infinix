<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User as UserModel;

class Profile extends Model
{
    use HasFactory;

    protected $table = 'profiles';

    protected $fillable = [
        'user_id',
        'display_name',
        'profile_photo',
        'cover_photo',
        'biography',
        'date_of_birth',
        'address',
        'gender',
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $this->updated_at->format('Y-m-d H:i:s');

        $data['created_at_time'] = $this->created_at->format('H:i:s');
        $data['updated_at_time'] = $this->updated_at->format('H:i:s');

        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        $data['updated_at_date'] = $this->updated_at->format('Y-m-d');

        return $data;
    }
    
}
