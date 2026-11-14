import { useCallback, useState } from "react";

/**
 * Simuliert das Absenden an einen Server (ohne Backend).
 * status: "idle" | "sending" | "done"
 */
export function useFakeSubmit(delay = 900) {
  const [status, setStatus] = useState("idle");

  const submit = useCallback(async () => {
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, delay));
    setStatus("done");
  }, [delay]);

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, submit, reset };
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

export const isGermanZip = (value) => /^\d{5}$/.test(value.trim());

export const isPhone = (value) => /^\+?[\d\s/()-]{6,20}$/.test(value.trim());

export const euro = (amount) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
