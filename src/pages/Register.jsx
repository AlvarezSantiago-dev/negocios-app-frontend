import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/sessions/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      // FIX 1: si res.ok es false => backend devolvió error
      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Error registrando usuario",
        });
        setLoading(false);
        return;
      }

      // FIX 2: asegurar éxito
      Swal.fire({
        icon: "success",
        title: "Cuenta creada 🎉",
        text: "Ahora podés iniciar sesión.",
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-[380px] shadow-xl backdrop-blur bg-white/70 border border-white/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Crear cuenta ✨
            </CardTitle>
            <p className="text-center text-gray-500 text-sm mt-1">
              Registrate para continuar
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <Input
                  type="text"
                  placeholder="Tu nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="tuemail@ejemplo.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Creando cuenta..." : "Registrarse"}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              ¿Ya tenés cuenta?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
