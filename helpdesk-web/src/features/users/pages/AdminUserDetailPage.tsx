import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import AdminUserDetail from "../components/AdminUserDetail";

function AdminUserDetailPage() {
  const { id } = useParams();

  const userId = Number(id);

  return (
    <div className="space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to users
      </Link>

      <AdminUserDetail userId={userId} />
    </div>
  );
}

export default AdminUserDetailPage;