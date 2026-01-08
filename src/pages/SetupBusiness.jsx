import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import {
  ArrowRight,
  Loader2,
  ShieldCheck,
  Store,
  Shirt,
  UtensilsCrossed,
  Settings2,
} from "lucide-react";

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

  const canConfigure = Boolean(user && user.role === 1);

  const options = [
    {
      key: "market",
      title: "Mercado",
      description: "Productos, ventas y caja",
      icon: Store,
      gradient: "from-blue-600 to-purple-600",
      pill: "General",
    },
    {
      key: "apparel",
      title: "Ropa",
      description: "Variantes por talle y color",
      icon: Shirt,
      gradient: "from-blue-600 to-purple-600",
      pill: "Variantes",
    },
    {
      key: "recipe",
      title: "Recetas",
      description: "Insumos y descuentos (próximamente)",
      icon: UtensilsCrossed,
      gradient: "from-blue-600 to-purple-600",
      pill: "Producción",
    },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Settings2 className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Configurar negocio
              </h1>
              <p className="text-gray-700 mt-2">
                Elegí el tipo de negocio. Esta acción se hace una sola vez.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700">
                  <ShieldCheck className="w-4 h-4" />
                  Solo ADMIN
                </span>
                {!canConfigure && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 border border-red-200 text-red-700">
                    Tu usuario no tiene permisos para configurar
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  className="group text-left rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  onClick={() => choose(opt.key)}
                  disabled={loading}
                >
                  <div className={`h-1.5 bg-gradient-to-r ${opt.gradient}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200">
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-r ${opt.gradient} text-white`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-900 text-lg">
                              {opt.title}
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700">
                              {opt.pill}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {opt.description}
                          </div>
                        </div>
                      </div>

                      <div className="mt-1 text-gray-400 group-hover:text-gray-700 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      Se aplicará a toda la instancia.
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
