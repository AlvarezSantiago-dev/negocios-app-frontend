import { useEffect, useRef } from "react";

/**
 * useBarcodeScanner
 * Detecta lectura por scanner (teclado rápido + Enter)
 */
export default function useBarcodeScanner({
  onScan,
  enabled = true,
  interCharTimeout = 60,
}) {
  const bufferRef = useRef("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // 🔴 BLOQUEO GLOBAL DEL ENTER DEL SCANNER
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        const code = bufferRef.current.trim();

        if (code.length > 0) {
          try {
            onScan(code);
          } catch (err) {
            console.error("onScan callback error", err);
          }
        }

        bufferRef.current = "";
        return;
      }

      // ignorar teclas especiales
      if (e.key.length !== 1) return;

      // reset timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      bufferRef.current += e.key;

      // timeout para distinguir tipeo humano
      timeoutRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, interCharTimeout);
    };

    // 🔴 CAPTURING = antes que React / Dialog / Form
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan, enabled, interCharTimeout]);
}
