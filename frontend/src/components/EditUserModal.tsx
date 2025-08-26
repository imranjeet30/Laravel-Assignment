import { useState } from "react";
import { UserDTO } from "../types";
import RoleCheckboxGroup from "./RoleCheckboxGroup";
import { createPortal } from "react-dom"; 

type Props = {
  user: UserDTO;
  onClose: () => void;
  onSave: (user: UserDTO) => void;
};

export default function EditUserModal({ user, onClose, onSave }: Props) {
  const [form, setForm] = useState<UserDTO>({...user});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Edit User</h2>

        <div className="space-y-1">
          <label className="text-sm font-medium">Full name</label>
          <input
            value={form.full_name}
            onChange={(e) => setForm({...form, full_name: e.target.value})}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Roles</label>
          <RoleCheckboxGroup
            values={form.roles}
            onChange={(roles) => setForm({...form, roles})}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl border px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="rounded-2xl bg-black px-4 py-2 text-white">
            Save
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
