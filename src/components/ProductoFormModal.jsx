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
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const tipo = watch("tipo");

  /* ---------- valores ---------- */
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
              <Input
                {...register("codigoBarras")}
                placeholder="Escaneá o generá uno"
              />
              <Button type="button" variant="secondary" onClick={generarCodigo}>
                Generar
              </Button>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <Label>Nombre</Label>
            <Input {...register("nombre", { required: true })} />
          </div>

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
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>

          {/* Unitario */}
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
                <div className="text-sm text-green-600">
                  Ganancia estimada: ${formatMoney(gananciaUnitario)}
                </div>
              )}
            </>
          )}

          {/* Pack */}
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
                placeholder="Costo del pack"
              />
              <Input
                type="number"
                {...register("precioVenta")}
                placeholder="Venta por unidad"
              />
              {gananciaPackUnidad > 0 && (
                <div className="text-sm text-green-600">
                  Ganancia por unidad: ${formatMoney(gananciaPackUnidad)}
                </div>
              )}
            </>
          )}

          {/* Categoría */}
          <Label>Categoría</Label>
          <Select
            value={watch("categoria")}
            onValueChange={(v) => setValue("categoria", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="bebidas">Bebidas</SelectItem>
              <SelectItem value="comida">Comida</SelectItem>
              <SelectItem value="limpieza">Limpieza</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            <Input {...register("stock")} placeholder="Stock" />
            <Input {...register("stockMinimo")} placeholder="Stock mínimo" />
          </div>

          {/* Foto */}
          <Input {...register("foto")} placeholder="Foto URL" />

          {/* Descripción */}
          <Textarea {...register("descripcion")} rows={3} />

          {initialData?._id && initialData?.codigoBarras && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onPrint(initialData)}
            >
              Imprimir código de barras
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
