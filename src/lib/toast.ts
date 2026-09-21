// Ported from music_mandi-website's `showToast()` + `#flowToast` element. A
// plain module function (no "use client" needed) dispatches a window
// CustomEvent; the <Toast /> component (mounted once in the public layout)
// listens for it, so any client component anywhere in the public tree can
// call `showToast(...)` without needing shared React context.
export const TOAST_EVENT = "mm-toast";

export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string>(TOAST_EVENT, { detail: message }),
  );
}
