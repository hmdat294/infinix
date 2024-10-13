<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permission_data_array = [
            // Account
            ['name' => 'can_login', 'description' => 'Can login'],
            // Create content
            ['name' => 'can_create_post', 'description' => 'Can create post'],
            ['name' => 'can_comment', 'description' => 'Can create post'],
            ['name' => 'can_send_message', 'description' => 'Can create post'],
            // Admin
            ['name' => 'can_access_dashboard', 'description' => 'Can access dashboard'],
        ];
        
        foreach($permission_data_array as $data) {
            
            Permission::create($data);
        }
    }
}
