export type RoleSlug = "author" | "editor" | "subscriber" | "administrator";

export const ALL_ROLES: RoleSlug[] = [
  "author",
  "editor",
  "subscriber",
  "administrator",
];

export interface UserDTO {
  id: number;
  full_name: string;
  email?: string;
  roles: RoleSlug[];
  created_at?: string | null;
}

export interface PaginatedUsers {
  data: UserDTO[];
  meta?: unknown; // you can type this to Laravel's pagination if needed
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}
