import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownProps {
  label: string;
  children: (close: () => void) => ReactNode;
}

export const Dropdown = ({ label, children }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border bg-white dark:bg-gray-800 transition-colors
          ${
            open
              ? "border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-100"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
      >
        {label}
        <span
          className={`text-xs text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 min-w-[190px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
};
