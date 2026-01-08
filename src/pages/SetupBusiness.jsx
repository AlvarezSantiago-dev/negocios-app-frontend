import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import useAuthStore from "../store/authStore";

export default function SetupBusiness() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/config");
        const payload = res?.data?.response;
        setConfigured(Boolean(payload?.configured));

        if (payload?.configured) {
          navigate("/", { replace: true });
        }
      } catch (e) {
        // si falla igual dejamos que intente configurar
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const choose = async (businessType) => {
    if (!user || user.role !== 1) {
      Swal.fire({
        icon: "error",
        title: "Sin permisos",
        text: "Solo un ADMIN puede configurar el negocio.",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/config/setup", { businessType });
      Swal.fire({
        icon: "success",
        title: "Listo",
        text: "Negocio configurado.",
        timer: 1200,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo configurar";

      Swal.fire({ icon: "error", title: "Error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (configured) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border p-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurar negocio</h1>
        <p className="text-gray-600 mt-2">
          Esta elección se hace una sola vez (solo ADMIN).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <button
            className="p-4 rounded-xl border bg-white hover:bg-gray-50 text-left"
            onClick={() => choose("market")}
            disabled={loading}
          >
            <div className="font-semibold text-gray-900">Mercado</div>
            <div className="text-sm text-gray-600">
              Productos + ventas + caja
            </div>
          </button>

          <button
            className="p-4 rounded-xl border bg-white hover:bg-gray-50 text-left"
            onClick={() => choose("apparel")}
            disabled={loading}
          >
            <div className="font-semibold text-gray-900">Ropa</div>
            <div className="text-sm text-gray-600">
              Talles/variantes (próximo)
            </div>
          </button>

          <button
            className="p-4 rounded-xl border bg-white hover:bg-gray-50 text-left"
            onClick={() => choose("recipe")}
            disabled={loading}
          >
            <div className="font-semibold text-gray-900">Recetas</div>
            <div className="text-sm text-gray-600">
              Insumos y descuento automático
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
