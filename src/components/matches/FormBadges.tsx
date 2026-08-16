import type { FormResult } from "../../services/api";

interface FormBadgesProps {
  results: FormResult[];
  size?: number;
}

const COLORS: Record<FormResult, string> = {
  W: "bg-emerald-500",
  D: "bg-gray-400",
  L: "bg-red-500",
};

const LABELS: Record<FormResult, string> = {
  W: "Win",
  D: "Draw",
  L: "Loss",
};

export const FormBadges = ({ results, size = 20 }: FormBadgesProps) => {
  if (results.length === 0) {
    return <span className="text-xs text-gray-300 dark:text-gray-600">—</span>;
  }

  return (
    <div className="flex gap-1">
      {results.map((r, i) => (
        <div
          key={i}
          title={LABELS[r]}
          style={{ width: size, height: size, fontSize: size * 0.5 }}
          className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${COLORS[r]}`}
        >
          {r}
        </div>
      ))}
    </div>
  );
};
