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

import useBarcodeScanner from "@/hooks/useBarcodeScanner";
import ProductoFormModal from "../components/ProductoFormModal";
import ModalIngresoPeso from "@/components/ModalIngresoPeso";

export default function Ventas() {
  const [products, setProducts] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [openModal, setOpenModal] = useState(false);
  const [initialProductData, setInitialProductData] = useState(null);

  const [openPesoModal, setOpenPesoModal] = useState(false);
  const [productoPesoActual, setProductoPesoActual] = useState(null);
  /* -------------------------------------------------- */
  /* DATA */
  /* -------------------------------------------------- */
  const cargarProductos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
    setProducts(res.data.response);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // ------------------------------------------------------
  // Integración del scanner
  // ------------------------------------------------------
  const onScan = async (codigo) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/barcode/${encodeURIComponent(
          codigo
        )}`
      );
      agregarAlCarrito(res.data.response);
    } catch {
      const result = await Swal.fire({
        title: "Producto no encontrado",
        text: `Código: ${codigo}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Crear producto",
      });

      if (result.isConfirmed) {
        setInitialProductData({
          codigoBarras: codigo,
          tipo: "unitario",
          categoria: "general",
        });
        setOpenModal(true);
      }
    }
  };

  useBarcodeScanner({ onScan, enabled: true, interCharTimeout: 60 });

  /* -------------------------------------------------- */
  /* CARRITO */
  /* -------------------------------------------------- */
  const agregarAlCarrito = (producto) => {
    if (!producto) return;

    if (producto.tipo === "peso") {
      setProductoPesoActual(producto);
      setOpenPesoModal(true);
      return;
    }

    if (producto.stock <= 0) {
      Swal.fire("Sin stock", "", "warning");
      return;
    }

    // lógica de packs / unidades
    const existente = carrito.find((i) => i.productoId === producto._id);

    if (existente) {
      const nuevaCantidad = existente.cantidad + 1;

      if (nuevaCantidad > producto.stock) {
        Swal.fire("Stock insuficiente", "", "warning");
        return;
      }

      const { tipoVenta, precioUnitario } = resolverPrecio(
        producto,
        nuevaCantidad
      );

      setCarrito(
        carrito.map((i) =>
          i.productoId === producto._id
            ? {
                ...i,
                cantidad: nuevaCantidad,
                tipoVenta,
                precioUnitarioAplicado: precioUnitario,
              }
            : i
        )
      );
    } else {
      setCarrito([
        ...carrito,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          cantidad: 1,
          tipoVenta: "unidad",
          precioUnitarioAplicado: producto.precioVenta,
          stock: producto.stock,
        },
      ]);
    }
  };

  // ------------------------------------------------------
  // actualizarCantidad, eliminarDelCarrito, total, registrarVenta
  // (igual que tenías)
  // ------------------------------------------------------
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const producto = products.find((p) => p._id === productoId);
    if (!producto) return;

    if (nuevaCantidad > producto.stock) {
      Swal.fire("Stock insuficiente", "", "warning");
      return;
    }

    const { tipoVenta, precioUnitario } = resolverPrecio(
      producto,
      nuevaCantidad
    );

    setCarrito(
      carrito.map((i) =>
        i.productoId === productoId
          ? {
              ...i,
              cantidad: nuevaCantidad,
              tipoVenta,
              precioUnitarioAplicado: precioUnitario,
            }
          : i
      )
    );
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter((i) => i.productoId !== productoId));
  };

  const total = carrito.reduce(
    (acc, i) => acc + i.precioUnitarioAplicado * i.cantidad,
    0
  );

  const registrarVenta = async () => {
    if (!carrito.length) {
      Swal.fire("Carrito vacío", "", "warning");
      return;
    }

    const payload = {
      metodoPago,
      items: carrito.map((i) => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
      })),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/ventas`,
        payload
      );

      const venta = res.data.response;

      // Mostrar mensaje de éxito en la misma página
      Swal.fire({
        title: "Venta registrada",
        text: "Ticket generado exitosamente. Puedes imprimirlo.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500, // 1.5 segundos
      });

      // 🔥 ABRIR TICKET
      if (venta.ticketUrl) {
        setTimeout(() => {
          window.open(
            `${import.meta.env.VITE_API_BACK_URL}${venta.ticketUrl}`,
            "_blank"
          );
        }, 1000); // Abre el ticket después de 1 segundo
      }

      // Limpia el carrito y recarga los productos
      setCarrito([]);
      cargarProductos();
    } catch (err) {
      console.error(err);
      Swal.fire("Error al registrar venta", "", "error");
    }
  };

  // ------------------------------------------------------
  // Manejo submit del modal de producto (cuando se crea desde escaneo)
  // ------------------------------------------------------
  const handleProductSubmit = async (data) => {
    try {
      // Llamada al store o API para crear producto
      await axios.post(`${import.meta.env.VITE_API_URL}/products`, data);
      setOpenModal(false);
      setInitialProductData(null);
      await cargarProductos();
      Swal.fire({
        title: "Producto creado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Error al crear producto", icon: "error" });
    }
  };
  /* -------------------------------------------------- */
  /* PESO */
  /* -------------------------------------------------- */
  const confirmarPeso = (peso) => {
    setCarrito([
      ...carrito,
      {
        productoId: productoPesoActual._id,
        nombre: productoPesoActual.nombre,
        cantidad: peso,
        tipoVenta: "peso",
        precioUnitarioAplicado: productoPesoActual.precioVenta,
        stock: productoPesoActual.stock,
      },
    ]);

    setProductoPesoActual(null);
    setOpenPesoModal(false);
  };

  const productosFiltrados = products.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const resolverPrecio = (producto, cantidad) => {
    if (!producto.packs || producto.packs.length === 0) {
      return {
        tipoVenta: "unidad",
        precioUnitario: producto.precioVenta,
      };
    }

    const packAplicable = producto.packs.find((p) => p.unidades === cantidad);

    if (packAplicable) {
      return {
        tipoVenta: "pack",
        precioUnitario: packAplicable.precioVentaPack / cantidad,
      };
    }

    return {
      tipoVenta: "unidad",
      precioUnitario: producto.precioVenta,
    };
  };
  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRODUCTOS */}
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>

          <CardContent className="h-[600px] flex flex-col gap-4">
            <Input
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />

            <ScrollArea className="flex-1">
              {productosFiltrados.map((p) => {
                const esPeso = p.tipo === "peso";
                const unidadStock = esPeso ? "kg" : "u";

                return (
                  <motion.div
                    key={p._id}
                    className="flex justify-between p-2 border rounded mb-2"
                  >
                    <div>
                      <p className="font-semibold">{p.nombre}</p>

                      <p className="text-sm opacity-70">
                        ${p.precioVenta} • Stock{" "}
                        {esPeso
                          ? Number(p.stock).toFixed(3)
                          : Number(p.stock).toFixed(0)}{" "}
                        {unidadStock}
                      </p>
                    </div>

                    <Button onClick={() => agregarAlCarrito(p)}>Agregar</Button>
                  </motion.div>
                );
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* CARRITO */}
        <Card>
          <CardHeader>
            <CardTitle>Carrito</CardTitle>
          </CardHeader>
          <CardContent className="h-[600px] flex flex-col">
            <ScrollArea className="flex-1">
              {carrito.map((i) => (
                <div
                  key={i.productoId}
                  className="grid grid-cols-6 gap-2 items-center mb-2"
                >
                  <p className="col-span-2">{i.nombre}</p>

                  <Input
                    type="number"
                    value={i.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(i.productoId, Number(e.target.value))
                    }
                  />

                  <p className="col-span-2 text-right font-semibold">
                    $
                    {(i.precioUnitarioAplicado * i.cantidad).toLocaleString(
                      "es-AR"
                    )}
                  </p>

                  <Button
                    variant="destructive"
                    onClick={() => eliminarDelCarrito(i.productoId)}
                  >
                    X
                  </Button>

                  {i.tipoVenta === "pack" && (
                    <p className="col-span-full text-xs text-green-600">
                      Precio pack aplicado
                    </p>
                  )}
                </div>
              ))}
            </ScrollArea>

            <Separator className="my-3" />

            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="mp">Mercado Pago</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 text-center">
              <p className="text-xl font-bold">
                ${total.toLocaleString("es-AR")}
              </p>
              <Button className="w-full mt-2" onClick={registrarVenta}>
                Registrar venta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductoFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleProductSubmit}
        initialData={initialProductData}
      />

      <ModalIngresoPeso
        open={openPesoModal}
        producto={productoPesoActual}
        onConfirm={confirmarPeso}
        onClose={() => setOpenPesoModal(false)}
      />
    </>
  );
}
