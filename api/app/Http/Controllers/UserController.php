<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct(private UserService $service) {
    }

    // POST /api/v1/users
    public function store(StoreUserRequest $request): UserResource
    {
        $data = $request->validated();
        $user = $this->service->createWithRoles(
            $request->string('full_name')->toString(),
            $request->string('email')->toString(),
            $request->input('roles', [])
        );
        
        return (new UserResource($user))->additional(['status' => 'created']);
    }

    // GET /api/v1/users?role=author
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::query()->with('roles');

        if ($role = $request->query('role')) {
            $query->whereHas('roles', fn ($q) => $q->where('slug', $role));
        }

        return UserResource::collection($query->latest()->paginate(10));
    }

    // BONUS: GET /api/v1/users/by-role
    public function byRole()
    {
        $roles = Role::with(['users' => function ($q) {
            $q->select('users.id', 'users.full_name', 'users.email');
        }])->get();

        // Return compact, front-end friendly structure
        $payload = $roles->mapWithKeys(fn ($r) => [
            $r->slug => $r->users->map(fn ($u) => [
                'id'        => $u->id,
                'full_name' => $u->full_name,
                'email'     => $u->email,
            ])->values(),
        ]);

        return response()->json(['data' => $payload]);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $user->update([
            'full_name' => $request->string('full_name')->toString(),
            'email'     => $request->string('email')->toString(),
        ]);

        $roleIds = Role::whereIn('slug', $request->input('roles'))->pluck('id')->all();
        $user->roles()->sync($roleIds);

        return (new UserResource($user))->additional(['status' => 'updated']);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['status' => 'deleted']);
    }
}
