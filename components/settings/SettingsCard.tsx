import { ReactNode } from "react";

export default function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl border shadow-sm p-8">
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}

      <div className="mt-8">{children}</div>
    </div>
  );
}
