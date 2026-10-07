import type { ActivityLogResponse } from '../types';
import { formatDate } from '../../../lib/formatDate';

interface ActivityLogTableProps {
  logs: ActivityLogResponse[];
}

function ActivityLogTable({ logs }: ActivityLogTableProps) {
  if (logs.length === 0) {
    return (
      <div>
        <p className="font-medium">No activity logs found</p>

        <p className="mt-1 text-sm text-muted-foreground">There are no activities to display.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">User</th>

            <th className="px-4 py-3 text-left font-medium">Action</th>

            <th className="px-4 py-3 text-left font-medium">Entity</th>

            <th className="px-4 py-3 text-left font-medium">Description</th>

            <th className="px-4 py-3 text-left font-medium">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{log.userName ?? 'System'}</td>

              <td className="px-4 py-3">{log.action}</td>

              <td className="px-4 py-3">
                {log.entityType}
                <span className="ml-1 text-muted-foreground">#{log.entityId}</span>
              </td>

              <td className="px-4 py-3 text-muted-foreground">{log.description ?? '-'}</td>

              <td className="px-4 py-3 text-muted-foreground">{formatDate(log.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityLogTable;
