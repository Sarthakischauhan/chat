"use client";

import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type BaseWidgetProps = {
  label: string;
  title: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function BaseWidget({
  label,
  title,
  status,
  meta,
  className,
  children,
}: BaseWidgetProps) {
  return (
    <section className={cn("chat-widget-card", className)} aria-label={label}>
      <header className="chat-widget-header">
        <div className="chat-widget-heading">
          {label ? <span className="chat-widget-label">{label}</span> : null}
          <div className="chat-widget-title">{title}</div>
        </div>
        {status ? <div className="chat-widget-status">{status}</div> : null}
      </header>

      {children ? <div className="chat-widget-body">{children}</div> : null}
      {meta ? <div className="chat-widget-meta">{meta}</div> : null}
    </section>
  );
}
