import { useState } from "react";

interface TeamCrestProps {
  src: string | null;
  alt: string;
  size?: number;
}

export const TeamCrest = ({ src, alt, size = 24 }: TeamCrestProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 shrink-0"
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="object-contain shrink-0"
      onError={() => setFailed(true)}
    />
  );
};
