"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { mergeWidgetRegistry } from "./builtin.widgets";
import {
  type ChatWidgetInput,
  type ChatWidgetRegistry,
  type WidgetResponse,
} from "./widget.registry";

export {
  createWidgetRegistry,
  defineWidget,
  getWidgetShellProps,
  isWidgetDefinition,
  readWidgetValue,
  resolveWidgetPart,
  type ChatWidgetComponent,
  type ChatWidgetDefinition,
  type ChatWidgetEntry,
  type ChatWidgetInput,
  type ChatWidgetProps,
  type ChatWidgetRegistry,
  type DefineWidgetOptions,
  type WidgetComponentProps,
  type WidgetControls,
  type WidgetResponse,
} from "./widget.registry";

type WidgetContextValue = {
  widgets: ChatWidgetRegistry;
  respondToWidget: (response: WidgetResponse) => Promise<void>;
  disabled: boolean;
};

const WidgetContext = createContext<WidgetContextValue | null>(null);

type WidgetProviderProps = {
  widgets?: ChatWidgetInput;
  respondToWidget: (response: WidgetResponse) => Promise<void>;
  disabled?: boolean;
  children: ReactNode;
};

export function WidgetProvider({
  widgets = {},
  respondToWidget,
  disabled = false,
  children,
}: WidgetProviderProps) {
  const registry = useMemo(() => mergeWidgetRegistry(widgets), [widgets]);
  const value = useMemo(
    () => ({
      widgets: registry,
      respondToWidget,
      disabled,
    }),
    [disabled, registry, respondToWidget],
  );

  return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>;
}

export function useWidgets() {
  const context = useContext(WidgetContext);

  if (!context) {
    return {
      widgets: mergeWidgetRegistry(),
      respondToWidget: async () => undefined,
      disabled: false,
    };
  }

  return context;
}
