<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'User 1',
                'email' => 'user1@gmail.com',
                'password' => Hash::make('user1@gmail.com'),
            ],
            [
                'name' => 'User 2',
                'email' => 'user2@gmail.com',
                'password' => Hash::make('user2@gmail.com'),
            ],
            [
                'name' => 'User 3',
                'email' => 'user3@gmail.com',
                'password' => Hash::make('user3@gmail.com'),
            ],
            [
                'name' => 'User 4',
                'email' => 'user4@gmail.com',
                'password' => Hash::make('user4@gmail.com'),
            ],
            [
                'name' => 'User 5',
                'email' => 'user5@gmail.com',
                'password' => Hash::make('user5@gmail.com'),
            ],
        ];
        user::insert($users);
    }
}
