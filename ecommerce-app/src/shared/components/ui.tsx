"use client";

import { forwardRef, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-400",
  secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost: "text-zinc-600 hover:bg-zinc-100 disabled:opacity-50",
};

export function Button({ variant = "primary", loading, children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}

    <input
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors
          ${error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"}
          ${className}`}
    />

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}

      <textarea
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-colors resize-none
          ${error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"}
          ${className}`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
);

Textarea.displayName = "Textarea";

type BadgeVariant = "green" | "yellow" | "red" | "zinc";

const badgeClasses: Record<BadgeVariant, string> = {
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  zinc: "bg-zinc-100 text-zinc-600",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "zinc" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClasses[variant]}`}>
      {children}
    </span>
  );
}

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md" }: SpinnerProps) {
  const sizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-8 h-8" };

  return (
    <svg className={`animate-spin ${sizes[size]} text-current`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />

      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

interface EmptyProps {
  message: string;
}

export function Empty({ message }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
          />
        </svg>
      </div>

      <p className="text-sm">{message}</p>
    </div>
  );
}

interface ErrorMsgProps {
  message: string;
}

export function ErrorMsg({ message }: ErrorMsgProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>

      {message}
    </div>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-base font-semibold text-zinc-900">{title}</h2>

          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
