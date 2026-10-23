"use client";

import type { FormEvent } from "react";

/** The Figma's "What's your work email?" form. There's no backend, so submitting jumps to the walkthrough. */
export function EmailForm({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    document.getElementById("how")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex h-[62px] w-full max-w-[500px] items-center gap-1 rounded-[12px] border p-[4px] ${
        dark ? "border-white/30 bg-white/10" : "border-[rgba(33,33,33,0.1)] bg-[rgba(33,33,33,0.02)]"
      } ${className}`}
    >
      <input
        type="email"
        aria-label="Work email"
        placeholder="What’s your work email?"
        className={`h-[52px] min-w-0 flex-1 rounded-[10px] bg-transparent px-5 text-[16px] outline-none ${
          dark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-muted"
        }`}
      />
      <button type="submit" className="h-[52px] shrink-0 rounded-[8px] bg-lime px-5 text-[16px] text-ink transition hover:brightness-95">
        Get started for free
      </button>
    </form>
  );
}
