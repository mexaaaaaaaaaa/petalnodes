import * as React from "react";
import { Link } from "react-router-dom";
import { isTodo } from "@/content";
import { cn } from "@/lib/utils";

export interface StickerButtonProps {
  children: React.ReactNode;
  href?: string;
  to?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  variant?: "primary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

export function StickerButton({
  children,
  href,
  to,
  onClick,
  variant = "primary",
  size = "md",
  external = false,
  disabled = false,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  type = "button",
  className,
  "aria-label": ariaLabel,
}: StickerButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  const todoHref = href && isTodo(href);
  const isDev = Boolean(import.meta.env?.DEV);
  const isInert = disabled || loading;

  const variantClasses =
    variant === "primary"
      ? "bg-blossom-600 text-white hover:bg-blossom-600/95"
      : variant === "dark"
        ? "bg-ink text-paper hover:bg-ink/90"
        : "bg-paper text-ink hover:bg-blossom-50";

  const sizeClasses =
    size === "sm"
      ? "h-10 px-4 text-sm"
      : size === "lg"
        ? "h-13 px-7 text-base md:text-lg"
        : "h-11 px-5 text-[15px]";

  const devTodoClass =
    todoHref && isDev
      ? "border-dashed outline-2 outline-dashed outline-blossom-600/50 outline-offset-2"
      : "";

  const sharedClass = cn(
    "sticker-btn rounded-sm font-display font-bold whitespace-nowrap shrink-0 select-none focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-ink focus-visible:outline-offset-3",
    isInert
      ? "opacity-60 cursor-not-allowed pointer-events-none shadow-[1px_1px_0_var(--color-ink)]"
      : "cursor-pointer",
    isPressed && !isInert && "translate-y-[2px] translate-x-[2px] shadow-[1px_1px_0_var(--color-ink)]",
    variantClasses,
    sizeClasses,
    devTodoClass,
    className,
  );

  const pressHandlers = isInert
    ? {}
    : {
        onPointerDown: () => setIsPressed(true),
        onPointerUp: () => setIsPressed(false),
        onPointerLeave: () => setIsPressed(false),
        onPointerCancel: () => setIsPressed(false),
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === " " || e.key === "Enter") setIsPressed(true);
        },
        onKeyUp: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === " " || e.key === "Enter") setIsPressed(false);
        },
      };

  const innerContent = (
    <>
      {loading && (
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0"
        />
      )}
      {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{loading && loadingText ? loadingText : children}</span>
      {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </>
  );

  if (to && !isInert) {
    return (
      <Link
        to={to}
        onClick={(e) => onClick?.(e)}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        className={sharedClass}
        {...pressHandlers}
      >
        {innerContent}
      </Link>
    );
  }

  if (href && !isInert) {
    return (
      <a
        href={href}
        onClick={(e) => {
          if (todoHref) {
            e.preventDefault();
          }
          onClick?.(e);
        }}
        target={external && !todoHref ? "_blank" : undefined}
        rel={external && !todoHref ? "noopener noreferrer" : undefined}
        title={todoHref && isDev ? "TODO: link" : undefined}
        aria-label={ariaLabel}
        aria-disabled={todoHref ? "true" : undefined}
        aria-busy={loading || undefined}
        className={sharedClass}
        {...pressHandlers}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={isInert}
      aria-disabled={isInert || undefined}
      aria-busy={loading || undefined}
      onClick={(e) => {
        if (!isInert) onClick?.(e);
      }}
      aria-label={ariaLabel}
      className={sharedClass}
      {...pressHandlers}
    >
      {innerContent}
    </button>
  );
}
