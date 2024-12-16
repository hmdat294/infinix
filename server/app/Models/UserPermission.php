<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    use HasFactory;

    protected $table = 'user_permissions';

    protected $fillable = [
        'user_id',
        'permission_id',
        'is_active',
        'enable_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function permission()
    {
        // update user_permissions table
        $user_permissions = UserPermission::where('user_id', $this->user_id)->get();
        foreach ($user_permissions as $user_permission) {
            if ($user_permission->enable_at < now()) {
                $user_permission->is_active = true;
                $user_permission->enable_at = null;
                $user_permission->save();
            }
        }


        return $this->belongsTo(Permission::class);
    }
}
