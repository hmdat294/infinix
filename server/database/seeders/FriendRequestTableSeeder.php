<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FriendRequest as FriendRequestModel;

class FriendRequestTableSeeder extends Seeder
{
    /**
     * Mỗi user gửi kết bạn với 2 user có id lớn hơn mình 1 và 2
     */
    public function run(): void
    {
        for ($i = 1; $i <= 9; $i++) {
            FriendRequestModel::create([
                'sender_id' => $i,
                'receiver_id' => $i + 1,
            ]);
        }

        for ($i = 1; $i <= 8; $i++) {
            FriendRequestModel::create([
                'sender_id' => $i + 2,
                'receiver_id' => $i,
            ]);
        }
    }
}
