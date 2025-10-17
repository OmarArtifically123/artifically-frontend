import { cn } from "../utils/cn";
import type { ReactNode } from "react";

export interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppLayout({ sidebar, header, children, className }: AppLayoutProps) {
  return (
    <div className={cn("ads-layout", className)}>
      <aside className="ads-layout__sidebar">{sidebar}</aside>
      <header className="ads-layout__header">{header}</header>
      <main className="ads-layout__main">{children}</main>
    </div>
  );
}