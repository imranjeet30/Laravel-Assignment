<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Author',        'slug' => 'author'],
            ['name' => 'Editor',        'slug' => 'editor'],
            ['name' => 'Subscriber',    'slug' => 'subscriber'],
            ['name' => 'Administrator', 'slug' => 'administrator'],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::firstOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
