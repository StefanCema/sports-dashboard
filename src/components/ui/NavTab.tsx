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
        ${
          active
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        }
      `}
    >
      {label}
    </button>
  );
};
