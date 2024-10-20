<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User as UserModel;
use App\Models\Post as PostModel;

class PostTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = UserModel::all();
        $totalPosts = 0;

        foreach ($users as $user) {
            $postCount = rand(2, 3);
            
            if ($totalPosts + $postCount > 25) {
                $postCount = 25 - $totalPosts;
            }

            PostModel::factory()->count($postCount)->create([
                'user_id' => $user->id
            ]);

            $totalPosts += $postCount;

            if ($totalPosts >= 25) {
                break;
            }
        }
    }
}
