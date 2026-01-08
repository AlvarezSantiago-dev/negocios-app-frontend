import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { Loader2 } from "lucide-react";

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

  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando configuración...
          </p>
        </div>
      </div>
    );
  if (configured) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">
            Configurar negocio
          </h1>
          <p className="text-gray-700 mt-2">
            Elegí el tipo de negocio. Esta acción se hace una sola vez (solo
            ADMIN).
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="group text-left rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              onClick={() => choose("market")}
              disabled={loading}
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="p-5">
                <div className="font-bold text-gray-900 text-lg">Mercado</div>
                <div className="text-sm text-gray-600 mt-1">
                  Productos + ventas + caja
                </div>
              </div>
            </button>

            <button
              className="group text-left rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              onClick={() => choose("apparel")}
              disabled={loading}
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="p-5">
                <div className="font-bold text-gray-900 text-lg">Ropa</div>
                <div className="text-sm text-gray-600 mt-1">
                  Talles / variantes
                </div>
              </div>
            </button>

            <button
              className="group text-left rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              onClick={() => choose("recipe")}
              disabled={loading}
            >
              <div className="h-1.5 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="p-5">
                <div className="font-bold text-gray-900 text-lg">Recetas</div>
                <div className="text-sm text-gray-600 mt-1">
                  Insumos y descuentos
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
