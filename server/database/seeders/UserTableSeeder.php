<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User as UserModel;
use App\Models\Profile as ProfileModel;
use App\Models\Permission as PermissionModel;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $user = UserModel::create([
                'email' => 'user' . $i . '@example.com',
                'password' => Hash::make('user' . $i . '@example.com')
            ]);

            ProfileModel::create([
                'user_id' => $user->id,
                'display_name' => 'User ' . $i,
            ]);

            $user->permissions()->attach(PermissionModel::where('name', '!=', 'can_access_dashboard')->pluck('id')->toArray());

        }
    }
}