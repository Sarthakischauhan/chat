import { Check } from "lucide-react";
import type { TaskRow } from "../../lib/message/task-row";

const glyph = (task: TaskRow, index: number) => {
  if (task.status === "completed") {
    return <Check size={12} strokeWidth={2.4} aria-hidden="true" />;
  }

  return <span>{task.step ?? index + 1}</span>;
};

export const TaskRows = ({ tasks }: { tasks: TaskRow[] }) => {
  if (!tasks.length) {
    return null;
  }

  return (
    <div className="chat-task-list" aria-label="Agent tasks">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`chat-task-row is-${task.status}`}
        >
          <span className="chat-task-glyph" aria-hidden="true">
            {glyph(task, index)}
          </span>
          <span className="chat-task-title">{task.title}</span>
          {task.meta ? <span className="chat-task-meta">{task.meta}</span> : null}
          {task.status === "completed" ? (
            <span className="chat-task-pill">Completed</span>
          ) : task.status === "failed" ? (
            <span className="chat-task-pill is-failed">Failed</span>
          ) : null}
        </div>
      ))}
    </div>
  );
};
