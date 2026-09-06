"use client";

import type { ChatMessage } from "../../types";
import { AssistantMessageItem } from "./message.item.assistant";
import { UserMessageItem } from "./message.item.user";

export const MessageItem = ({ message }: { message: ChatMessage }) =>
  message.role === "user" ? (
    <UserMessageItem message={message} />
  ) : (
    <AssistantMessageItem message={message} />
  );
