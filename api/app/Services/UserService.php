<?php

// app/Services/UserService.php
declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function createWithRoles(string $fullName, string $email, array $roleSlugs): User
    {
        return DB::transaction(function () use ($fullName, $email, $roleSlugs) {
            $user = User::create([
                'full_name' => $fullName,
                'email'     => $email,
                // 'password' => bcrypt(Str::random(12)), // optional
            ]);

            $roleIds = Role::whereIn('slug', $roleSlugs)->pluck('id')->all();
            $user->roles()->sync($roleIds);

            return $user->load('roles');
        });
    }
}
