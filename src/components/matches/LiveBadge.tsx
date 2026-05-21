interface LiveBadgeProps {
  minute?: string;
}

export const LiveBadge = ({ minute }: LiveBadgeProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-medium text-emerald-600">
        {minute ?? 'LIVE'}
      </span>
    </div>
  );
};