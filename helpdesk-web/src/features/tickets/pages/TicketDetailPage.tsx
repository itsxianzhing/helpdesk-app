import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import TicketDetail from "../components/TicketDetail";

function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);

  return (
    <div className="space-y-6">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to tickets
      </Link>

      <TicketDetail ticketId={ticketId} />
    </div>
  );
}

export default TicketDetailPage;