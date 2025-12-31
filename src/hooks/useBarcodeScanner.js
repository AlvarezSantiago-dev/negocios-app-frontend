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
    // 🔴 SI SE DESACTIVA → LIMPIAR TODO
    if (!enabled) {
      bufferRef.current = "";
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    const isTypingInInput = () => {
      const el = document.activeElement;
      if (!el) return false;

      return (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.isContentEditable
      );
    };

    const handleKeyDown = (e) => {
      // 🔴 NO ESCANEAR SI EL USUARIO ESTÁ ESCRIBIENDO
      if (isTypingInInput()) return;

      // 🔴 ENTER DEL SCANNER
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        const code = bufferRef.current.trim();

        if (code.length > 0) {
          onScan(code);
        }

        bufferRef.current = "";
        return;
      }

      // ignorar teclas especiales
      if (e.key.length !== 1) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      bufferRef.current += e.key;

      timeoutRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, interCharTimeout);
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan, enabled, interCharTimeout]);
}
