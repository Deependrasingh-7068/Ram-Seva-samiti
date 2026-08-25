import { Crown, UserCheck } from 'lucide-react';

export default function OBBadge({ postedByRole, adminName, createdBy, authorName, bearerDesignation, size = 'sm' }) {
  const isOB = postedByRole === 'OFFICE_BEARER';
  const name = isOB ? (authorName || adminName) : (adminName || (createdBy ? createdBy.split('@')[0] : 'Admin'));

  if (isOB) {
    return (
      <span className="flex items-center gap-1 text-navy font-bold bg-gradient-to-r from-gold to-saffron px-2.5 py-0.5 rounded-md border border-gold shadow-md truncate ml-2">
        <Crown size={11} className="shrink-0" /> By OB{bearerDesignation ? ` (${bearerDesignation})` : ''}: {name}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-gold font-medium bg-saffron/10 px-2 py-0.5 rounded-md border border-gold/20 truncate ml-2">
      <UserCheck size={11} className="text-saffron shrink-0" /> By Admin: {name}
    </span>
  );
}