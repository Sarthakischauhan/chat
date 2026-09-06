"use client";

import { useLayoutEffect, type RefObject } from "react";

const STREAMING_STATUSES = new Set(["submitted", "streaming"]);

export const useStickToBottom = (
  containerRef: RefObject<HTMLElement | null>,
  {
    contentKey,
    status,
  }: {
    contentKey: unknown;
    status: string;
  },
) => {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [containerRef, contentKey, status]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !STREAMING_STATUSES.has(status)) {
      return;
    }

    const scrollToEnd = () => {
      container.scrollTop = container.scrollHeight;
    };

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(container);
    const inner = container.firstElementChild;
    if (inner) {
      observer.observe(inner);
    }

    scrollToEnd();

    return () => observer.disconnect();
  }, [containerRef, status]);
};
