interface NavTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const NavTab = ({ label, active, onClick }: NavTabProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-lg text-sm transition-all duration-150
        ${active
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {label}
    </button>
  );
};