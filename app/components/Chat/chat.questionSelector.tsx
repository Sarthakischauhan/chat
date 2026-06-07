"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getUserDisplayText } from "@/lib/message/user";
import { useChat } from "./chat.context";

const MAX_QUESTION_LENGTH = 120;

const getQuestionTargetId = (messageId: string) =>
  `thread-question-${messageId}`;

const compactQuestion = (text: string) => {
  const compacted = text.replace(/\s+/g, " ").trim();

  if (compacted.length <= MAX_QUESTION_LENGTH) {
    return compacted;
  }

  return `${compacted.slice(0, MAX_QUESTION_LENGTH - 3)}...`;
};

export const ChatQuestionSelector = () => {
  const { messages } = useChat();
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const questions = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user")
        .map((message, index) => ({
          id: message.id,
          index,
          text: compactQuestion(getUserDisplayText(message)),
        }))
        .filter((question) => question.text.length > 0),
    [messages],
  );

  if (questions.length < 3) {
    return null;
  }

  const scrollToQuestion = (messageId: string) => {
    setActiveQuestionId(messageId);

    const target = document.getElementById(getQuestionTargetId(messageId));
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
    target?.animate(
      [
        { backgroundColor: "rgb(0 0 0 / 0.06)" },
        { backgroundColor: "rgb(0 0 0 / 0)" },
      ],
      {
        duration: 900,
        easing: "ease-out",
      },
    );
  };

  return (
    <nav
      aria-label="Thread questions"
      className="group/thread-selector fixed right-6 top-1/2 z-20 hidden min-h-25 w-fit -translate-y-1/2 md:block"
    >
      <div className="flex min-h-25 items-center justify-center p-2">
        <div className="flex flex-col items-center justify-center gap-1.5">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              className={cn(
                "h-1 w-6 cursor-pointer bg-muted-foreground/25 transition-colors hover:bg-foreground focus-visible:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeQuestionId === question.id && "bg-foreground",
              )}
              onClick={() => scrollToQuestion(question.id)}
            >
              <span className="sr-only">
                Jump to question {question.index + 1}: {question.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 w-80 -translate-y-1/2 translate-x-1 opacity-0 transition duration-150 group-hover/thread-selector:pointer-events-auto group-hover/thread-selector:translate-x-0 group-hover/thread-selector:opacity-100 group-focus-within/thread-selector:pointer-events-auto group-focus-within/thread-selector:translate-x-0 group-focus-within/thread-selector:opacity-100">
        <div className="max-h-[min(64svh,34rem)] overflow-y-auto rounded-lg border border-border/70 bg-background/95 p-2.5 shadow-xl shadow-black/10 backdrop-blur">
          <div className="space-y-1.5">
            {questions.map((question) => (
              <button
                key={question.id}
                type="button"
                title={question.text}
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-start rounded-md p-3 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeQuestionId === question.id && "bg-muted",
                )}
                onClick={() => scrollToQuestion(question.id)}
              >
                <span className="line-clamp-2 flex-1 leading-snug text-foreground">
                  {question.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const getThreadQuestionTargetId = getQuestionTargetId;
