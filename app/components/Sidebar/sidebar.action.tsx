'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

import {
  SidebarMenuAction,
} from '@/components/ui/sidebar';

type SidebarActionItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void | Promise<void>;
};

export function SidebarThreadActions({
  title,
  actions,
}: {
  title: string;
  actions: SidebarActionItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef}>
      <SidebarMenuAction
        showOnHover
        aria-label={`Open actions for ${title}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="h-5 w-5 hover:bg-sidebar-accent focus-visible:ring-2"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen((open) => !open);
        }}
      >
        <MoreHorizontal />
      </SidebarMenuAction>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-9 right-1 z-20 min-w-28 rounded-md bg-background p-1 shadow-md"
          onClick={(event) => event.stopPropagation()}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              onClick={() => {
                setIsOpen(false);
                void action.onClick();
              }}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
