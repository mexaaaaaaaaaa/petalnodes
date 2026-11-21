import * as React from "react";
import { X } from "lucide-react";
import { listTodos } from "@/content";

export function DevTodoBadge() {
  if (!import.meta.env || !import.meta.env.DEV) {
    return null;
  }
  return <DevTodoBadgeInner />;
}

function DevTodoBadgeInner() {
  const [open, setOpen] = React.useState(false);
  const todos = React.useMemo(() => listTodos(), []);

  if (todos.length === 0) return null;

  const urlCount = todos.filter((t) => t.isUrl).length;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-2 w-80 max-h-80 overflow-y-auto rounded-sm border-2 border-ink bg-paper p-4 shadow-[4px_4px_0_var(--color-ink)] text-xs">
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-dashed border-paper-line">
            <span className="font-handwriting font-bold text-sm text-blossom-600">
              TODOs ({todos.length} total · {urlCount} URLs)
            </span>
            <button
              type="button"
              aria-label="Close TODO list"
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-paper-shade rounded-sm cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="space-y-1.5 text-ink-soft">
            {todos.map((t, i) => (
              <li key={i} className="leading-snug">
                <span className="font-mono text-[11px] font-semibold text-ink">
                  {t.path}
                </span>
                {t.isUrl ? " [URL]" : ""}: {t.value}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="font-handwriting text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-paper border-2 border-blossom-600 text-blossom-600 rounded-[3px] shadow-[2px_2px_0_var(--color-ink)] -rotate-3 hover:rotate-0 transition-transform cursor-pointer"
      >
        TODO × {todos.length}
      </button>
    </div>
  );
}
