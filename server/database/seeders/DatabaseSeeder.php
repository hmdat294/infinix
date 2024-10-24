<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\PermissionsTableSeeder;

class DatabaseSeeder extends Seeder
{
    
    public function run(): void
    {
        $this->call([
            PermissionsTableSeeder::class,
            UserTableSeeder::class,
            FriendRequestTableSeeder::class,
            RelationshipTableSeeder::class,
        ]);
    }
}
