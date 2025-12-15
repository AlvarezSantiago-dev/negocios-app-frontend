import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import MoneyInput from "@/components/MoneyInput";
import { formatMoney } from "@/services/money";

/* ---------- Tooltip ---------- */
function Tooltip({ text }) {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative inline-block">
      <Info
        size={14}
        className="text-gray-400 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-56 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50"
        >
          {text}
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Modal ---------- */
export default function ProductoFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  onPrint,
}) {
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const tipo = watch("tipo");

  /* ---------- valores string ---------- */
  const precioCompra = watch("precioCompra") || "";
  const precioVenta = watch("precioVenta") || "";
  const unidadPorPack = Number(watch("unidadPorPack") || 0);
  const precioCompraPack = watch("precioCompraPack") || "";

  /* ---------- cálculos ---------- */
  const gananciaUnitario =
    Number(precioVenta) > 0 && Number(precioCompra) > 0
      ? Number(precioVenta) - Number(precioCompra)
      : 0;

  const costoUnitarioPack =
    unidadPorPack > 0 ? Number(precioCompraPack || 0) / unidadPorPack : 0;

  const gananciaPackUnidad =
    Number(precioVenta) > 0 && costoUnitarioPack > 0
      ? Number(precioVenta) - costoUnitarioPack
      : 0;

  /* ---------- efectos ---------- */
  useEffect(() => {
    reset(
      initialData || {
        nombre: "",
        categoria: "general",
        tipo: "unitario",
        precioCompra: "",
        precioVenta: "",
        unidadPorPack: "",
        precioCompraPack: "",
        stock: "",
        stockMinimo: "",
        foto: "",
        descripcion: "",
        codigoBarras: "",
      }
    );
  }, [initialData, reset]);

  useEffect(() => {
    if (tipo === "pack") {
      setValue("precioCompra", "");
    } else {
      setValue("precioCompraPack", "");
      setValue("unidadPorPack", "");
    }
  }, [tipo, setValue]);

  /* ---------- submit ---------- */
  const handleCleanSubmit = (data) => {
    const clean = {
      ...data,
      precioVenta: Number(data.precioVenta || 0),
      stock: Number(data.stock || 0),
      stockMinimo: Number(data.stockMinimo || 0),
    };

    if (data.tipo === "pack") {
      clean.unidadPorPack = Number(data.unidadPorPack || 0);
      clean.precioCompraPack = Number(data.precioCompraPack || 0);
      delete clean.precioCompra;
    } else {
      clean.precioCompra = Number(data.precioCompra || 0);
      delete clean.unidadPorPack;
      delete clean.precioCompraPack;
    }

    if (!clean.codigoBarras) delete clean.codigoBarras;

    onSubmit(clean);
  };

  /* ---------- generar código ---------- */
  const generarCodigo = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/generate-barcode`
    );

    setValue("codigoBarras", res.data.codigoBarras, {
      shouldDirty: true,
    });
  };

  /* ---------- render ---------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCleanSubmit)} className="space-y-4">
          {/* Código de barras */}
          <div className="space-y-2">
            <Label>Código de barras</Label>
            <div className="flex gap-2">
              <Input {...register("codigoBarras")} />
              <Button type="button" variant="secondary" onClick={generarCodigo}>
                Generar
              </Button>
            </div>
          </div>
          {/* Nombre */}
          <Input
            {...register("nombre", { required: true })}
            placeholder="Nombre"
          />
          {/* Tipo */}
          <div className="flex items-center gap-1">
            <Label>Tipo</Label>
            <Tooltip text="Unitario, por peso o pack" />
          </div>
          <Select value={tipo} onValueChange={(v) => setValue("tipo", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitario">Unitario</SelectItem>
              <SelectItem value="peso">Por peso</SelectItem>
            </SelectContent>
          </Select>
          {/* Unitario */}
          {tipo !== "pack" && (
            <>
              <MoneyInput
                value={precioCompra}
                onChange={(v) => setValue("precioCompra", v)}
                placeholder="Precio compra"
              />
              <MoneyInput
                value={precioVenta}
                onChange={(v) => setValue("precioVenta", v)}
                placeholder="Precio venta"
              />

              {gananciaUnitario > 0 && (
                <div className="text-sm text-green-600">
                  Ganancia estimada: ${formatMoney(gananciaUnitario)}
                </div>
              )}
            </>
          )}
          <h3 className="font-semibold">Packs (opcional)</h3>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Unidades" />
            <MoneyInput placeholder="Precio pack" />
            <Button variant="ghost">+</Button>
          </div>
          {/* Pack */}
          {/* CATEGORÍA */}
          <div className="flex items-center gap-1">
            <Label>Categoría</Label>
            <Tooltip text="Sirve para filtrar productos en inventario" />
          </div>
          <Select
            defaultValue={initialData?.categoria || "general"}
            onValueChange={(v) => setValue("categoria", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="bebidas">Bebidas</SelectItem>
              <SelectItem value="comida">Comida</SelectItem>
              <SelectItem value="limpieza">Limpieza</SelectItem>
            </SelectContent>
          </Select>
          {/* STOCK */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-1">
              <Label>Stock</Label>
              <Tooltip text="Cantidad actual de este producto en inventario" />
            </div>
            <Input type="number" {...register("stock")} />
            <div className="flex items-center gap-1">
              <Label>Stock Mínimo</Label>
              <Tooltip text="Si el stock baja de este número, se marcará alerta en dashboard" />
            </div>
            <Input type="number" {...register("stockMinimo")} />
          </div>
          {/* FOTO */}
          <div className="flex items-center gap-1">
            <Label>Foto URL</Label>
            <Tooltip text="Opcional. Se mostrará en el dashboard e inventario" />
          </div>
          <Input {...register("foto")} /> {/* DESCRIPCIÓN */}
          <div className="flex items-center gap-1">
            <Label>Descripción</Label>
            <Tooltip text="Opcional. Información adicional sobre el producto" />
          </div>
          <Textarea rows={3} {...register("descripcion")} />
          {initialData?._id && initialData?.codigoBarras && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onPrint(initialData)}
            >
              Imprimir código barras
            </Button>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{initialData ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
