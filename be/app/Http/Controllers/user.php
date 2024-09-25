<?php

namespace App\Http\Controllers;

use App\Http\Resources\user as ResourcesUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class user extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            $data = new ResourcesUser(Auth::user());
            return response()->json($data);
        } else {
            return response()->json(['message' => 'Chưa đăng nhập!']);
        }
    }
}
