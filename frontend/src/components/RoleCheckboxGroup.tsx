import { ALL_ROLES, RoleSlug } from "../types";

type Props = {
  values: RoleSlug[];
  onChange: (next: RoleSlug[]) => void;
};

const label = (r: RoleSlug) => r.charAt(0).toUpperCase() + r.slice(1);

export default function RoleCheckboxGroup({ values, onChange }: Props) {
  const toggle = (role: RoleSlug) => {
    if (values.includes(role)) onChange(values.filter(r => r !== role));
    else onChange([...values, role]);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {ALL_ROLES.map((r) => (
        <label
          key={r}
          className={`flex items-center gap-2 rounded-2xl border p-3 cursor-pointer
          ${values.includes(r) ? "border-gray-900 bg-gray-50" : "border-gray-200"}`}
        >
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={values.includes(r)}
            onChange={() => toggle(r)}
          />
          <span className="text-sm font-medium">{label(r)}</span>
        </label>
      ))}
    </div>
  );
}
