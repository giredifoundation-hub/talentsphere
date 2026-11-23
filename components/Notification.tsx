
"use client";

import { useEffect } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

type NotificationProps = {
  message: string;
  type?: NotificationType;
  onClose: () => void;
};

export default function Notification({
  message,
  type = "info",
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-blue-200 bg-blue-50 text-blue-900",
  };

  const icons = {
    success: "✓",
    error: "!",
    warning: "!",
    info: "i",
  };

  return (
    <div className="fixed right-4 top-5 z-[100] w-[calc(100%-2rem)] max-w-md">
      <div
        role={type === "error" ? "alert" : "status"}
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl ${styles[type]}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current font-bold">
          {icons[type]}
        </span>

        <p className="flex-1 text-sm font-medium leading-6">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg px-2 py-1 text-lg hover:bg-black/5"
        >
          ×
        </button>
      </div>
    </div>
  );
}
