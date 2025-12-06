import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Ventas() {
  const [products, setProducts] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);

      setProducts(res.data.response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Agregar al carrito
  // Dentro de la función agregarAlCarrito:
  const agregarAlCarrito = (prod) => {
    if (prod.stock === 0) {
      Swal.fire({
        title: "Sin stock",
        text: "No podés agregar un producto sin stock.",
        icon: "warning",
      });
      return;
    }

    const existe = carrito.find((item) => item._id === prod._id);
    const incremento = prod.tipo === "peso" ? 1 : 1; // 1kg por defecto, no 0.1
    if (existe && existe.cantidad + incremento > prod.stock) {
      Swal.fire({
        title: "Stock insuficiente",
        text: `No hay más ${
          prod.tipo === "peso" ? "kg" : "unidades"
        } disponibles.`,
        icon: "warning",
      });
      return;
    }

    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item._id === prod._id
            ? {
                ...item,
                cantidad: parseFloat((item.cantidad + incremento).toFixed(3)),
              }
            : item
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          _id: prod._id,
          nombre: prod.nombre,
          precioVenta: prod.precioVenta,
          cantidad: incremento,
          stock: prod.stock,
          tipo: prod.tipo,
        },
      ]);
    }
  };

  // Actualizar cantidad manual
  const actualizarCantidad = (id, nuevaCantidad) => {
    const item = carrito.find((p) => p._id === id);
    if (!item) return;

    if (item.tipo === "unitario" || item.tipo === "pack") {
      if (nuevaCantidad < 1) return;
    } else if (item.tipo === "peso") {
      if (nuevaCantidad < 0.1) return; // mínimo 100 gramos
    }

    if (nuevaCantidad > item.stock) {
      Swal.fire({
        title: "Límite alcanzado",
        text: `Solo hay ${item.stock} ${
          item.tipo === "peso" ? "kg" : "unidades"
        } disponibles.`,
        icon: "warning",
      });
      return;
    }

    setCarrito(
      carrito.map((prod) =>
        prod._id === id
          ? { ...prod, cantidad: parseFloat(nuevaCantidad.toFixed(3)) }
          : prod
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item._id !== id));
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precioVenta * item.cantidad,
    0
  );

  const registrarVenta = async () => {
    if (carrito.length === 0) {
      Swal.fire({ title: "Carrito vacío", icon: "warning" });
      return;
    }

    const payload = {
      metodoPago,
      items: carrito.map((item) => ({
        productoId: item._id,
        cantidad: item.cantidad,
      })),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/ventas`, payload);

      Swal.fire({
        title: "Venta registrada",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setCarrito([]);
      cargarProductos();
    } catch (err) {
      console.log(err);
      Swal.fire({ title: "Error al registrar", icon: "error" });
    }
  };

  const productosFiltrados = products.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LISTA DE PRODUCTOS */}
      <Card className="h-full rounded-2xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 h-[600px]">
          <Input
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <ScrollArea className="flex-1 rounded-md border p-3">
            <div className="flex flex-col gap-3">
              {productosFiltrados.map((p) => (
                <motion.div
                  key={p._id}
                  className="flex justify-between items-center border rounded-md px-3 py-2 shadow-sm bg-white hover:scale-[1.01] transition-all"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <p className="font-semibold">{p.nombre}</p>
                    <p className="text-sm opacity-70">
                      ${p.precioVenta} • Stock: {p.stock}
                      {p.tipo === "peso"
                        ? " kg"
                        : p.tipo === "pack"
                        ? " u."
                        : ""}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    disabled={p.stock === 0}
                    onClick={() => agregarAlCarrito(p)}
                  >
                    {p.stock === 0 ? "Sin stock" : "Agregar"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* CARRITO */}
      <Card className="h-full rounded-2xl shadow-md border border-gray-100">
        <CardHeader>
          <CardTitle>Carrito</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[600px]">
          <ScrollArea className="flex-1 rounded-md border p-3">
            <div className="flex flex-col gap-3">
              {carrito.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-6 items-center gap-3 border rounded-md px-3 py-2 shadow-sm bg-white hover:scale-[1.01] transition-all"
                >
                  <p className="col-span-2 font-semibold">{item.nombre}</p>
                  <Input
                    type="number"
                    className="w-24"
                    step={item.tipo === "peso" ? 0.1 : 1}
                    value={item.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(item._id, Number(e.target.value))
                    }
                  />
                  <p className="text-right font-semibold col-span-2">
                    $
                    {parseFloat(
                      item.precioVenta * item.cantidad
                    ).toLocaleString("es-AR")}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => eliminarDelCarrito(item._id)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator className="my-4" />

          <div className="mb-4">
            <p className="mb-1 font-semibold">Método de pago</p>
            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="mp">Mercado Pago</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-auto bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Total a pagar</p>
            <p className="text-3xl font-bold text-gray-800">
              ${total.toLocaleString("es-AR")}
            </p>
            <Button
              className="mt-3 w-full py-3 text-lg"
              onClick={registrarVenta}
            >
              Registrar venta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
