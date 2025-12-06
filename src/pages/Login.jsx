import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginStore = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/sessions/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, contraseña }),
    });

    const loginData = await res.json();
    if (loginData.statusCode !== 200) {
      alert("Credenciales inválidas");
      setLoading(false);
      return;
    }

    const res2 = await fetch(
      `${import.meta.env.VITE_API_URL}/sessions/online`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const userData = await res2.json();
    if (!userData?.user) {
      alert("Error obteniendo usuario");
      setLoading(false);
      return;
    }

    loginStore(userData.user);
    navigate("/");
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
              Bienvenido 👋
            </CardTitle>
            <p className="text-center text-gray-500 text-sm mt-1">
              Inicia sesión para continuar
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="tuemail@ejemplo.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
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
                {loading ? "Ingresando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
