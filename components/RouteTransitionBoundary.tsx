"use client";

import { usePathname } from "next/navigation";

export default function RouteTransitionBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily disabled animations to debug routing
  // TODO: Re-enable after routing is confirmed working
  return <>{children}</>;
}