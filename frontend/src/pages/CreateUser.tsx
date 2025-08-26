import { useState } from "react";
import api from "../lib/api";
import { RoleSlug, ApiError } from "../types";
import RoleCheckboxGroup from "../components/RoleCheckboxGroup";
import { useNavigate } from "react-router-dom";

type FormState = {
  full_name: string;
  email: string;
  roles: RoleSlug[];
};

export default function CreateUser() {
  const [form, setForm] = useState<FormState>({
    full_name: "",
    email: "",
    roles: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<Record<string,string[]>>({});
  const [generalError, setGeneralError] = useState<string>("");

  const navigate = useNavigate();

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // basic client-side validation
  const validate = () => {
    const errs: Record<string,string[]> = {};
    if (!form.full_name.trim()) errs.full_name = ["Full name is required."];
    if (!form.email.trim()) errs.email = ["Email is required."];
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = ["Invalid email format."];
    if (form.roles.length === 0) errs.roles = ["At least one role is required."];
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrors({});
    setGeneralError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setServerErrors(errs);
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/users", {
        full_name: form.full_name,
        email: form.email,
        roles: form.roles,
      });
      navigate("/users"); // redirect to listing
    } catch (err: any) {
      const data: ApiError = err?.response?.data ?? {};
      setServerErrors(data.errors ?? {});
      setGeneralError(data.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create User</h1>
          <a href="/users" className="text-3xl font-bold text-gray-800 mb-6">Users</a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={submit} className="bg-white rounded-2xl shadow p-6 space-y-6">
          {generalError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">
              {generalError}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Full name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={onInput}
              placeholder="Ada Lovelace"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900"
            />
            {serverErrors.full_name && (
              <p className="text-xs text-red-600">{serverErrors.full_name[0]}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email address</label>
            <input
              name="email"
              value={form.email}
              onChange={onInput}
              placeholder="ada@example.com"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-900"
            />
            {serverErrors.email && (
              <p className="text-xs text-red-600">{serverErrors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Roles</label>
            <RoleCheckboxGroup
              values={form.roles}
              onChange={(roles) => setForm((f) => ({ ...f, roles }))}
            />
            {serverErrors.roles && (
              <p className="text-xs text-red-600">{serverErrors.roles[0]}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-black px-5 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save user"}
            </button>
            <a href="/users" className="text-sm underline">Cancel</a>
          </div>
        </form>
      </main>
    </div>
  );
}
