"use client";

import { useId, useState, useTransition, type ReactNode } from "react";
import { uploadImage } from "@/lib/content/actions";

export function Field({
  label,
  value,
  onChange,
  dir,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="dash-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="dash-input"
        dir={dir}
        style={dir === "ltr" ? { textAlign: "start" } : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className="dash-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="dash-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1.5 text-xs text-ink-sand/70">{hint}</p>}
    </div>
  );
}

/** Add / remove / reorder for a list of objects, each rendered by the caller. */
export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  addLabel,
  renderItem,
  summary,
  emptyLabel = "لا عناصر بعد.",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  summary: (item: T, index: number) => string;
  emptyLabel?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex((current) => (current === index ? target : current));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && (
        <p className="text-sm text-ink-sand/70">{emptyLabel}</p>
      )}

      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={index} className="dash-card p-0">
            <div className="flex items-center gap-2 p-3">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex-1 text-start text-sm font-bold text-ink-ivory hover:text-ink-gold"
              >
                <span className="me-2 text-ink-gold">{open ? "▾" : "▸"}</span>
                {summary(item, index) || "بدون عنوان"}
              </button>

              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="تحريك لأعلى"
                className="dash-btn dash-btn-ghost dash-btn-sm"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="تحريك لأسفل"
                className="dash-btn dash-btn-ghost dash-btn-sm"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="حذف"
                className="dash-btn dash-btn-danger dash-btn-sm"
              >
                حذف
              </button>
            </div>

            {open && (
              <div className="flex flex-col gap-4 border-t border-white/10 p-4">
                {renderItem(item, (patch) => update(index, patch), index)}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onChange([...items, makeNew()]);
          setOpenIndex(items.length);
        }}
        className="dash-btn dash-btn-ghost self-start"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** Edits an array of plain strings (bio paragraphs, specialties). */
export function StringListEditor({
  label,
  items,
  onChange,
  addLabel,
  multiline,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <span className="dash-label">{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                className="dash-textarea"
                rows={3}
                value={value}
                aria-label={`${label} ${index + 1}`}
                onChange={(e) =>
                  onChange(items.map((v, i) => (i === index ? e.target.value : v)))
                }
              />
            ) : (
              <input
                className="dash-input"
                value={value}
                aria-label={`${label} ${index + 1}`}
                onChange={(e) =>
                  onChange(items.map((v, i) => (i === index ? e.target.value : v)))
                }
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="حذف"
              className="dash-btn dash-btn-danger dash-btn-sm mt-1"
            >
              حذف
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="dash-btn dash-btn-ghost dash-btn-sm self-start"
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
}

/** Upload / preview / clear one image. */
export function ImagePicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  hint?: string;
}) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.ok && result.path) {
        onChange(result.path);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <div>
      <span className="dash-label">{label}</span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-stone-950">
          {value ? (
            // Plain <img>: these are user uploads of unknown dimensions and the
            // dashboard is not performance-critical.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-ink-sand/60">
              لا صورة
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
            className="text-xs text-ink-sand file:me-3 file:rounded file:border-0 file:bg-stone-700 file:px-3 file:py-1.5 file:text-ink-ivory"
            onChange={(e) => handleFile(e.target.files?.[0])}
            disabled={pending}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="dash-btn dash-btn-danger dash-btn-sm self-start"
            >
              إزالة الصورة
            </button>
          )}
          {pending && <p className="text-xs text-ink-gold">جارٍ الرفع…</p>}
          {error && (
            <p role="alert" className="text-xs text-[var(--color-danger)]">
              {error}
            </p>
          )}
          {hint && !error && (
            <p className="text-xs text-ink-sand/70">{hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
