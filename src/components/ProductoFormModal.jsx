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
import { formatMoney } from "@/services/dashboardService";

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
  // 👇 watch SALE DE ACÁ
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const tipo = watch("tipo");

  /* ---------- watches numéricos ---------- */
  const precioCompra = Number(watch("precioCompra") || 0);
  const precioVenta = Number(watch("precioVenta") || 0);
  const unidadPorPack = Number(watch("unidadPorPack") || 0);
  const precioCompraPack = Number(watch("precioCompraPack") || 0);

  /* ---------- cálculos ---------- */
  const gananciaUnitario =
    precioVenta > 0 && precioCompra > 0 ? precioVenta - precioCompra : 0;

  const costoUnitarioPack =
    unidadPorPack > 0 ? precioCompraPack / unidadPorPack : 0;

  const gananciaPackUnidad =
    precioVenta > 0 && costoUnitarioPack > 0
      ? precioVenta - costoUnitarioPack
      : 0;

  /* ---------- efectos ---------- */
  useEffect(() => {
    if (tipo === "pack") {
      setValue("precioCompra", undefined);
    } else {
      setValue("precioCompraPack", undefined);
      setValue("unidadPorPack", undefined);
    }
  }, [tipo, setValue]);

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
        stock: 0,
        stockMinimo: 0,
        foto: "",
        descripcion: "",
        codigoBarras: "",
      }
    );
  }, [initialData, reset]);

  /* ---------- submit ---------- */
  const handleCleanSubmit = (data) => {
    const clean = { ...data };

    if (clean.tipo !== "pack") {
      delete clean.precioCompraPack;
      delete clean.unidadPorPack;
    }

    if (clean.tipo === "pack") {
      clean.unidadPorPack = Number(clean.unidadPorPack);
      clean.precioCompraPack = Number(clean.precioCompraPack);
      delete clean.precioCompra;
    }

    clean.precioCompra =
      clean.tipo !== "pack" ? Number(clean.precioCompra || 0) : undefined;
    clean.precioVenta = Number(clean.precioVenta || 0);
    clean.stock = Number(clean.stock || 0);
    clean.stockMinimo = Number(clean.stockMinimo || 0);

    if (clean.codigoBarras) {
      clean.codigoBarras = String(clean.codigoBarras).trim();
    } else {
      delete clean.codigoBarras;
    }

    onSubmit(clean);
  };

  const generarCodigo = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/generate-barcode`
    );
    setValue("codigoBarras", res.data.codigoBarras, { shouldDirty: true });
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
          {/* TIPO */}
          <div className="flex items-center gap-1">
            <Label>Tipo</Label>
            <Tooltip text="Unitario, peso o pack" />
          </div>
          <Select
            defaultValue={initialData?.tipo || "unitario"}
            onValueChange={(v) => setValue("tipo", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unitario">Unitario</SelectItem>
              <SelectItem value="peso">Por peso</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
          {/* PRECIOS UNITARIO */}
          {tipo !== "pack" && (
            <>
              <Input
                type="number"
                {...register("precioCompra")}
                placeholder="Precio compra"
              />
              <Input
                type="number"
                {...register("precioVenta")}
                placeholder="Precio venta"
              />

              {gananciaUnitario > 0 && (
                <div className="text-sm font-medium text-green-600">
                  Ganancia estimada por unidad: ${formatMoney(gananciaUnitario)}
                </div>
              )}
            </>
          )}
          {/* PRECIOS PACK */}
          {tipo === "pack" && (
            <>
              <Input
                type="number"
                {...register("unidadPorPack")}
                placeholder="Unidades por pack"
              />
              <Input
                type="number"
                {...register("precioCompraPack")}
                placeholder="Costo pack"
              />
              <Input
                type="number"
                {...register("precioVenta")}
                placeholder="Venta por unidad"
              />

              {gananciaPackUnidad > 0 && (
                <div className="text-sm font-medium text-green-600">
                  Ganancia estimada por unidad: $
                  {formatMoney(gananciaPackUnidad)}
                </div>
              )}
            </>
          )}
          {/* CATEGORÍA */}{" "}
          <div className="flex items-center gap-1">
            {" "}
            <Label>Categoría</Label>{" "}
            <Tooltip text="Sirve para filtrar productos en inventario" />{" "}
          </div>{" "}
          <Select
            defaultValue={initialData?.categoria || "general"}
            onValueChange={(v) => setValue("categoria", v)}
          >
            {" "}
            <SelectTrigger>
              {" "}
              <SelectValue placeholder="Seleccionar categoría" />{" "}
            </SelectTrigger>{" "}
            <SelectContent>
              {" "}
              <SelectItem value="general">General</SelectItem>{" "}
              <SelectItem value="bebidas">Bebidas</SelectItem>{" "}
              <SelectItem value="comida">Comida</SelectItem>{" "}
              <SelectItem value="limpieza">Limpieza</SelectItem>{" "}
            </SelectContent>{" "}
          </Select>{" "}
          {/* STOCK */}{" "}
          <div className="grid grid-cols-2 gap-3">
            {" "}
            <div className="flex items-center gap-1">
              {" "}
              <Label>Stock</Label>{" "}
              <Tooltip text="Cantidad actual de este producto en inventario" />{" "}
            </div>{" "}
            <Input type="number" {...register("stock")} />{" "}
            <div className="flex items-center gap-1">
              {" "}
              <Label>Stock Mínimo</Label>{" "}
              <Tooltip text="Si el stock baja de este número, se marcará alerta en dashboard" />{" "}
            </div>{" "}
            <Input type="number" {...register("stockMinimo")} />{" "}
          </div>{" "}
          {/* FOTO */}{" "}
          <div className="flex items-center gap-1">
            {" "}
            <Label>Foto URL</Label>{" "}
            <Tooltip text="Opcional. Se mostrará en el dashboard e inventario" />{" "}
          </div>{" "}
          <Input {...register("foto")} /> {/* DESCRIPCIÓN */}{" "}
          <div className="flex items-center gap-1">
            {" "}
            <Label>Descripción</Label>{" "}
            <Tooltip text="Opcional. Información adicional sobre el producto" />{" "}
          </div>{" "}
          <Textarea rows={3} {...register("descripcion")} />{" "}
          {initialData?._id && initialData?.codigoBarras && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onPrint(initialData)}
            >
              {" "}
              Imprimir código barras{" "}
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
