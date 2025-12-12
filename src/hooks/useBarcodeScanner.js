// src/hooks/useBarcodeScanner.js
import { useEffect, useRef } from "react";

/**
 * useBarcodeScanner
 * @param {Object} options
 * @param {(codigo: string) => void} options.onScan - callback when a barcode is read
 * @param {boolean} [options.enabled=true] - whether the listener is active
 * @param {number} [options.interCharTimeout=60] - ms to differentiate scanner vs human typing
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
      // reset timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // if Enter -> process buffer
      if (e.key === "Enter") {
        const code = bufferRef.current.trim();
        if (code.length > 0) {
          try {
            onScan(code);
          } catch (err) {
            // swallow errors from consumer callback
            console.error("onScan callback error", err);
          }
        }
        bufferRef.current = "";
        return;
      }

      // accept only printable single chars
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }

      // if no more characters within interCharTimeout, clear buffer (human typing)
      timeoutRef.current = setTimeout(() => {
        bufferRef.current = "";
      }, interCharTimeout);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onScan, enabled, interCharTimeout]);
}
