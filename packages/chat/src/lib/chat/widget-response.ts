type WidgetResponseLike = {
  actionId?: string;
  label?: string;
  value: unknown;
};

export const widgetResponseText = (response: WidgetResponseLike) =>
  response.actionId ??
  response.label ??
  (typeof response.value === "string" ? response.value : JSON.stringify(response.value));
