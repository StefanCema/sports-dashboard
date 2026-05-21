interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const FilterChip = ({ label, active, onClick }: FilterChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
        ${active
          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
        }
      `}
    >
      {label}
    </button>
  );
};