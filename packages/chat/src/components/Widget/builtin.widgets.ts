import { questionWidget } from "./question";
import {
  createWidgetRegistry,
  type ChatWidgetInput,
  type ChatWidgetRegistry,
} from "./widget.registry";

export const builtinWidgets = [questionWidget];

export const mergeWidgetRegistry = (widgets: ChatWidgetInput = {}): ChatWidgetRegistry => ({
  ...createWidgetRegistry(builtinWidgets),
  ...createWidgetRegistry(widgets),
});
