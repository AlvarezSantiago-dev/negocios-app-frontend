import { useEffect, useState } from "react";

export default function TestScanner() {
  const [buffer, setBuffer] = useState("");
  const [lastScan, setLastScan] = useState("");
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    let temp = "";
    let lastTime = Date.now();

    const handleKeyDown = (e) => {
      const now = Date.now();
      const delta = now - lastTime;

      // Registrar cada tecla presionada
      setTimestamps((prev) => [...prev, `${e.key} (${delta}ms)`]);

      // Si pasa más de 80ms → probablemente es teclado normal
      if (delta > 80) {
        temp = "";
      }

      if (e.key === "Enter") {
        setLastScan(temp);
        setBuffer(temp);
        temp = "";
      } else {
        temp += e.key;
      }

      lastTime = now;
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">TEST ESCÁNER</h1>

      <p className="mb-2">Buffer actual detectado:</p>
      <pre className="p-3 bg-gray-100 rounded-md border mb-4">
        {buffer || "—"}
      </pre>

      <p className="mb-2">Último escaneo (al presionar ENTER):</p>
      <pre className="p-3 bg-green-100 rounded-md border mb-4">
        {lastScan || "—"}
      </pre>

      <p className="mb-2">Eventos recibidos (debug):</p>
      <div className="h-40 overflow-auto bg-black text-green-400 p-2 text-sm rounded-md">
        {timestamps.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    </div>
  );
}
