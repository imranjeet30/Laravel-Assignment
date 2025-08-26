import { RoleSlug } from "../types";

const pretty: Record<RoleSlug,string> = {
  author: "Author",
  editor: "Editor",
  subscriber: "Subscriber",
  administrator: "Admin",
};

export default function RoleBadge({ role }: { role: RoleSlug }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
      {pretty[role]}
    </span>
  );
}
