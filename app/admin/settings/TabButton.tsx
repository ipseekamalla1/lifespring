import React from "react";

export default function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition
        ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-primary"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}
