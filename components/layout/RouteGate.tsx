"use client";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
  exclude: string[];
}

// Hides the marketing site chrome (header/banner/footer) on routes that ship their own
// dedicated header (admin sidebar, portal navy header) — those are pre-rendered server
// components passed in as `children`, so this just decides whether to mount them.
export default function RouteGate({ children, exclude }: Props) {
  const pathname = usePathname();
  const excluded = exclude.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (excluded) return null;
  return <>{children}</>;
}
