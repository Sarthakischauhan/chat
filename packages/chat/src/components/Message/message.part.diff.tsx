import { truncateDiffs, type DiffChip } from "../../lib/message/diff-summary";

const basename = (file: string) => file.split("/").filter(Boolean).at(-1) ?? file;

export const DiffChips = ({ diffs, limit = 4 }: { diffs: DiffChip[]; limit?: number }) => {
  const { visible, hidden } = truncateDiffs(diffs, limit);

  if (!visible.length) {
    return null;
  }

  return (
    <div className="chat-diff-row" aria-label="File changes">
      {visible.map((chip) => (
        <span key={`${chip.file}-${chip.additions ?? 0}-${chip.deletions ?? 0}`} className="chat-diff-chip">
          <span className="chat-diff-file">{basename(chip.file)}</span>
          {chip.additions ? <span className="chat-diff-add">+{chip.additions}</span> : null}
          {chip.deletions ? <span className="chat-diff-del">−{chip.deletions}</span> : null}
        </span>
      ))}
      {hidden > 0 ? <span className="chat-diff-more">+{hidden} more</span> : null}
    </div>
  );
};
