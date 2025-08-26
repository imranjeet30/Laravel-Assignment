import { useEffect, useState } from "react";
import api from "../lib/api";
import { ALL_ROLES, UserDTO, RoleSlug } from "../types";
import RoleBadge from "../components/RoleBadge";
import RoleCheckboxGroup from "../components/RoleCheckboxGroup";
import { createPortal } from "react-dom";
import EditUserModal from "../components/EditUserModal";

export default function Users() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [role, setRole] = useState<RoleSlug | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = role === "all" ? "/users" : `/users?role=${role}`;
      const res = await api.get(url);
      setUsers(res.data.data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const deleteUser = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  const saveEdit = async (user: UserDTO) => {
    try {
      await api.put(`/users/${user.id}`, {
        full_name: user.full_name,
        email: user.email,
        roles: user.roles,
      });
      setEditingUser(null);
      fetchUsers();
    } catch {
      alert("Failed to update user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-gray-50">
        <div className="text-gray-900 mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold">Create user</a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <label className="text-sm">Filter by role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleSlug | "all")}
            className="rounded-xl border border-gray-300 px-3 py-2"
          >
            <option value="all">All</option>
            {ALL_ROLES.map(r => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>

        {loading && <div className="text-sm">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="grid gap-3">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
              <div>
                <div className="font-medium">{u.full_name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
                <div className="flex gap-2 mt-1">
                  {u.roles.map(r => <RoleBadge key={r} role={r} />)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUser(u)}
                  className="rounded-2xl border px-3 py-1 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="rounded-2xl border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSave={saveEdit}
          />
        )}
      </main>
    </div>
  );
}
