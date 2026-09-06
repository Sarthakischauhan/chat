import type {
  AgentDataPart,
  AgentToolPart,
  AgentWidgetPart,
  AgentWidgetProps,
} from "@sarchauhan/protocol";

export const isPropsRecord = (value: unknown): value is AgentWidgetProps =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const asWidgetFromTool = (part: AgentToolPart): AgentWidgetPart | null => {
  const source =
    part.state === "output-available" && part.output !== undefined
      ? part.output
      : part.input;

  if (!isPropsRecord(source)) {
    return null;
  }

  return {
    type: "widget",
    name: part.toolName,
    id: part.toolCallId,
    props: source,
    interactive: part.toolName === "question" || source.interactive === true,
  };
};

export const asWidgetFromData = (part: AgentDataPart): AgentWidgetPart => ({
  type: "widget",
  name: part.name,
  id: part.id,
  props: isPropsRecord(part.data) ? part.data : { value: part.data },
  interactive: isPropsRecord(part.data) ? part.data.interactive === true : false,
});
