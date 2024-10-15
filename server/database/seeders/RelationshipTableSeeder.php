<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Relationship as RelationshipModel;

class RelationshipTableSeeder extends Seeder
{
    /**
     * Mỗi user kết bạn với 2 user có id lớn hơn mình 3 và 4 và follow 1 user có id lớn hơn mình 5
     */
    public function run(): void
    {
        for ($i = 1; $i <= 7; $i++) {
            RelationshipModel::create([
                'user_id' => $i,
                'related_user_id' => $i + 3,
                'type' => 'friend',
            ]);
        }

        for ($i = 1; $i <= 6; $i++) {
            RelationshipModel::create([
                'user_id' => $i + 4,
                'related_user_id' => $i,
                'type' => 'friend',
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            RelationshipModel::create([
                'user_id' => $i,
                'related_user_id' => $i + 5,
                'type' => 'follow',
            ]);
        }
    }
}
