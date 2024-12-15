<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\UserPermission;
use Illuminate\Http\Request;

class PunishmentController extends Controller
{
    public function index()
    {

    }

    public function store(Request $request)
    {

        $permissions = $request->input('permissions');
        $user_id = $request->input('user_id');
        $hour = (int) $request->input('hour');

        foreach ($permissions as $detail_permission) {
            $permission = Permission::where('name', $detail_permission)->first();

            $user_permission = UserPermission::where('user_id', $user_id)->where('permission_id', $permission->id)->first();
    
            if ($user_permission) {
                $user_permission->enable_at = now()->addHours($hour);
                $user_permission->is_active = false;
                $user_permission->save();
            } else {
                $user_permission = UserPermission::create([
                    'user_id'=> $user_id,
                    'permission_id'=> $permission->id,
                    'is_active'=> false,
                    'enable_at'=> now()->addHours($hour)
                ]);
            } 
        }
    }
}
