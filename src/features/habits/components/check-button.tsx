"use client";

import { useRef } from "react";
import confetti from "canvas-confetti";
import { HABIT_COLORS, type HabitColor } from "@/shared/constants";
import { CheckIcon } from "@/shared/icons";
import { cn } from "@/shared/lib/utils";

type CheckButtonProps = {
  checked: boolean;
  color: HabitColor;
  onToggle: () => void;
  disabled?: boolean;
  label: string;
};

export function CheckButton({
  checked,
  color,
  onToggle,
  disabled,
  label,
}: CheckButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { css, hex } = HABIT_COLORS[color];

  function handleClick() {
    if (!checked && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      confetti({
        particleCount: 22,
        spread: 65,
        startVelocity: 16,
        gravity: 0.8,
        ticks: 80,
        scalar: 0.7,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: [hex, "#f97316", "#fbbf24"],
        disableForReducedMotion: true,
      });
    }
    onToggle();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={checked}
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full border-2 transition-transform active:scale-90",
        checked ? "border-transparent" : "border-border bg-transparent"
      )}
      style={checked ? { backgroundColor: css } : undefined}
    >
      {checked && (
        <span key="checked" className="animate-pop">
          <CheckIcon className="size-6 text-white" />
        </span>
      )}
    </button>
  );
}
