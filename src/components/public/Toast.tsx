"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TOAST_EVENT } from "@/lib/toast";
import styles from "./Toast.module.css";

// Mounted once in the (public) layout so it's available on every public
// route. Fires via the `showToast()` helper in src/lib/toast.ts.
export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMessage(detail);
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 2600);
    };
    window.addEventListener(TOAST_EVENT, handler);
    return () => {
      window.removeEventListener(TOAST_EVENT, handler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={cn(styles.toast, visible && styles.on)} id="flowToast">
      {message}
    </div>
  );
}
