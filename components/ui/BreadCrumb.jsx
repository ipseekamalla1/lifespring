"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-emerald-700">
      <Link
        href="/"
        className="font-medium hover:underline"
      >
        Dashboard
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        const label = decodeURIComponent(segment)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <span key={href} className="flex items-center">
            <ChevronRight size={16} className="mx-2 text-emerald-400" />

            {index === segments.length - 1 ? (
              <span className="font-semibold text-emerald-900">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:underline"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
