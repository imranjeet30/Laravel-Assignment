<?php

// app/Http/Resources/UserResource.php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'        => $this->id,
            'full_name' => $this->full_name,
            'email'     => $this->email,
            'roles'     => $this->roles->pluck('slug')->values(),
            'created_at'=> $this->created_at?->toISOString(),
        ];
    }
}
