import { Link } from "react-router";
import type { UserResponse } from "../types";
import { formatDate } from "../../../lib/formatDate";

interface UserTableProps {
  users: UserResponse[];
}

function UserTable({
  users,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium">
              Name
            </th>

            <th className="px-4 py-3 font-medium">
              Email
            </th>

            <th className="px-4 py-3 font-medium">
              Role
            </th>

            <th className="px-4 py-3 font-medium">
              Status
            </th>

            <th className="px-4 py-3 font-medium">
              Created
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-muted/30"
            >
              <td className="px-4 py-3">
                <Link
                  to={`/admin/users/${user.id}`}
                  className="font-medium hover:underline"
                >
                  {user.name}
                </Link>
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {user.email}
              </td>

              <td className="px-4 py-3">
                {user.role}
              </td>

              <td className="px-4 py-3">
                {user.status}
              </td>

              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(user.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;