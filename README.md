Full Stack Developer Assignment

```plaintext

Application: Save Full name, Email and Roles using Laravel (API) + React (frontend)

Roles: author, editor, subscriber, administrator

## Summary

This repository contains a small, production-minded Full Stack application built with Laravel (10/11) for the backend and React (17/18) for the frontend. The app demonstrates:

A Laravel API that stores users and allows multiple roles per user (many-to-many relationship).

Validations for email, full_name, and roles.

A simple React frontend (hooks + functional components) that consumes the API using axios.

Redirect to the users listing page after a successful submission.


## Features

Create user with one or more roles

List users grouped by roles

Backend validation and clear error responses

Frontend form with client-side minimal validation and API integration

Clean, SOLID-friendly Laravel structure (Model, Services, Controller, FormRequest)

## Backend

/API
  app/
    Models/
      User.php
      Role.php
    Http/
      Controllers/
        UserController.php
      Requests/
        StoreUserRequest.php
    Services/
      UserService.php
  database/
    migrations/
    seeders/
  routes/
    api.php
  composer.json

## Frontend
/frontend
  src/
    components/
      EditUserModal.tsx
      RoleBadge.tsx
      RoleCheckboxGroup.tsx
    lib/
      api.ts
    pages
        CreateUser.tsx
        Users.tsx
    types.ts
    App.tsx
    index.tsx
  package.json

## Prerequisites

PHP 8.1+

Composer

Node.js 16+ and npm

MySQL (or any DB supported by Laravel)

## Backend (Laravel) — Local Setup

Clone the repo and go to backend folder:

git clone <repo_url>
cd <repo>/backend

Install PHP dependencies:

composer install

Copy .env and generate app key:

cp .env.example .env
php artisan key:generate

## Edit .env database settings:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

Run migrations and seed roles:

php artisan migrate
php artisan db:seed --class=RoleSeeder

Start the dev server:

php artisan serve

By default the backend runs at http://127.0.0.1:8000.

## Frontend (React) — Local Setup

Change to frontend folder and install dependencies:

cd ../frontend
npm install

## frontend/.env
Create .env with API URL (frontend will use this to call backend):

REACT_APP_API_BASE_URL=http://localhost:8000/api/v1

Start the frontend dev server:

npm start

React app usually runs at http://localhost:3000.

.env (examples)

## Backend (backend/.env):

APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:YOUR_KEY
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=users_db
DB_USERNAME=root
DB_PASSWORD=secret

Frontend (frontend/.env):

REACT_APP_API_URL=http://127.0.0.1:8000/api

Database Design (high level)

users table (id, full_name, email, timestamps)

roles table (id, key, label, timestamps) — pre-seeded with 4 roles

role_user pivot table (user_id, role_id)

Migrations should follow Laravel conventions and the pivot table should have composite unique index.

## Key Backend Pieces

Models

User: roles() relationship -> belongsToMany(Role::class)

Role: users() relationship -> belongsToMany(User::class)

Form Request Validation (StoreUserRequest)

Rules:

public function rules()
{
    return [
        'full_name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'roles' => 'required|array|min:1',
        'roles.*' => 'string|exists:roles,key',
    ];
}

Notes:

roles expects an array of role keys (e.g. ['author','editor']) — controller will map keys to role IDs.

Controller (Api/UserController)

store(Request $request) — validates and creates user, attach roles, returns 201 with created user.

index(Request $request) — returns users grouped by roles. Supports optional filtering ?role=author or ?grouped=true.

POST /api/users — sample body:

{
  "full_name": "Ada Lovelace",
  "email": "ada@example.com",
  "roles": ["author","editor"]
}

Success response (201):

{ "success": true, "user": { "id":1, "full_name":"Ada Lovelace", "email":"ada@example.com", "roles":["author","editor"] } }

Frontend (React) Implementation Notes

Use functional components + hooks (useState, useEffect, useNavigate from react-router-dom).

Use axios to call the API.

After successful POST, redirect to /users list.

Example api.ts

import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

Creat User
export const createUser = (payload) => api.post('/users', payload);
export const getUsers = () => api.get('/users');

Example form submit (React)

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await createUser({ full_name, email, roles });
    navigate('/users');
  } catch (err) {
  }
};

Display users grouped by role — call getUsers() and render the roles object.

Seeders

Created a RoleSeeder to seed the four roles (key + label):

[
  ['key' => 'author', 'label' => 'Author'],
  ['key' => 'editor', 'label' => 'Editor'],
  ['key' => 'subscriber', 'label' => 'Subscriber'],
  ['key' => 'administrator', 'label' => 'Administrator'],
]

Run:

php artisan db:seed --class=RoleSeeder

Backend:

Validation failures (missing email / not unique)

Successful creation and pivot table entries

GET /api/users responses

Frontend:

Troubleshooting

SQLSTATE[HY000] [1045] — check DB credentials in .env

unique validation failing on update — use unique:users,email,{$userId} for update scenarios

\Barryvdh\Cors\HandleCors or configure app/Http/Middleware/HandleCors.php and set allowed_origins in config/cors.php