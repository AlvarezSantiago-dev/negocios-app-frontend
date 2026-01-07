import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  DollarSign,
  Package,
  Barcode,
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import useBarcodeScanner from "@/hooks/useBarcodeScanner";
import ProductoFormModal from "../components/ProductoFormModal";
import ModalIngresoPeso from "@/components/ModalIngresoPeso";
import { formatMoney } from "@/services/dashboardService";

// Componente de Botón de Acción
function ActionButton({
  onClick,
  disabled,
  variant = "primary",
  children,
  icon: Icon,
  className = "",
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    success:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white",
    danger:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}

export default function Ventas() {
  const [products, setProducts] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");

  const [openModal, setOpenModal] = useState(false);
  const [initialProductData, setInitialProductData] = useState(null);
  const [openPesoModal, setOpenPesoModal] = useState(false);
  const [productoPesoActual, setProductoPesoActual] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* DATA */
  const cargarProductos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data.response);
    } catch (error) {
      console.error(error);
      Swal.fire("Error al cargar productos", "", "error");
    } finally {
      setIsLoading(false);
    }
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

  // Íconos de métodos de pago
  const getMetodoIcon = (metodo) => {
    switch (metodo) {
      case "efectivo":
        return <DollarSign className="w-5 h-5" />;
      case "mp":
        return <Smartphone className="w-5 h-5" />;
      case "transferencia":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Cargando ventas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Punto de Venta
          </h1>
          <p className="text-gray-600">
            Escanea o selecciona productos para registrar una venta
          </p>
        </motion.div>

        {/* SCANNER INFO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-100">
              <Barcode className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Escáner de Código de Barras Activo
              </p>
              <p className="text-sm text-gray-600">
                Escanea un producto para agregarlo automáticamente al carrito
              </p>
            </div>
          </div>
        </motion.div>

        {/* GRID PRODUCTOS Y CARRITO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PANEL DE PRODUCTOS */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Productos Disponibles
                </h3>
              </div>

              {/* BUSCADOR */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar producto..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-12 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <ScrollArea className="h-[600px] p-4">
              <div className="space-y-3">
                {productosFiltrados.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mb-3" />
                    <p className="text-gray-500">No se encontraron productos</p>
                  </div>
                ) : (
                  productosFiltrados.map((p, i) => {
                    const esPeso = p.tipo === "peso";
                    const unidadStock = esPeso ? "kg" : "u";
                    const stockBajo = p.stock <= p.stockMinimo;

                    return (
                      <motion.div
                        key={p._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {p.nombre}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-green-600">
                              ${formatMoney(p.precioVenta)}
                            </span>
                            <span className="text-gray-500">•</span>
                            <span
                              className={`font-medium ${
                                stockBajo ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              Stock:{" "}
                              {esPeso
                                ? Number(p.stock).toFixed(3)
                                : Number(p.stock).toFixed(0)}{" "}
                              {unidadStock}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => agregarAlCarrito(p)}
                          disabled={p.stock <= 0 && p.tipo !== "peso"}
                          className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </motion.div>

          {/* PANEL DE CARRITO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Carrito de Compras
                  </h3>
                </div>
                <div className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">
                  {carrito.length} {carrito.length === 1 ? "item" : "items"}
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4" style={{ maxHeight: "400px" }}>
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-1">Carrito vacío</p>
                  <p className="text-sm text-gray-400">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {carrito.map((i) => (
                    <motion.div
                      key={i.productoId}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {i.nombre}
                          </p>
                          {i.tipoVenta === "pack" && (
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Pack aplicado
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => eliminarDelCarrito(i.productoId)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              actualizarCantidad(i.productoId, i.cantidad - 1)
                            }
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <Input
                            type="number"
                            value={i.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(
                                i.productoId,
                                Number(e.target.value)
                              )
                            }
                            className="w-20 text-center font-semibold"
                            min="1"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              actualizarCantidad(i.productoId, i.cantidad + 1)
                            }
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <p className="text-xl font-bold text-gray-900">
                          ${formatMoney(i.precioUnitarioAplicado * i.cantidad)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* FOOTER CON TOTAL Y ACCIONES */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              {/* MÉTODO DE PAGO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <Select value={metodoPago} onValueChange={setMetodoPago}>
                  <SelectTrigger className="bg-white border-gray-300 rounded-xl">
                    <div className="flex items-center gap-2">
                      {getMetodoIcon(metodoPago)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Efectivo
                      </div>
                    </SelectItem>
                    <SelectItem value="mp">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Mercado Pago
                      </div>
                    </SelectItem>
                    <SelectItem value="transferencia">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Transferencia
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TOTAL */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-sm font-medium opacity-90 mb-1">
                  Total a Pagar
                </p>
                <p className="text-4xl font-bold">${formatMoney(total)}</p>
              </div>

              {/* BOTÓN REGISTRAR */}
              <ActionButton
                onClick={registrarVenta}
                disabled={carrito.length === 0}
                variant="success"
                icon={CheckCircle}
                className="w-full py-4 text-lg"
              >
                Registrar Venta
              </ActionButton>
            </div>
          </motion.div>
        </div>

        {/* MODALES */}
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
      </div>
    </div>
  );
}
