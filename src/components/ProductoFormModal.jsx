import { useForm } from "react-hook-form";
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

// --- Componente Tooltip ---
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

// --- Modal Principal ---
export default function ProductoFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const tipo = watch("tipo");

  useEffect(() => {
    if (tipo === "pack") {
      // pack no usa precioCompra unitario
      setValue("precioCompra", undefined);
    } else {
      // unitario/peso no usan pack
      setValue("precioCompraPack", undefined);
      setValue("unidadPorPack", undefined);
    }
  }, [tipo]);

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
  }, [initialData]);

  const handleCleanSubmit = (data) => {
    const clean = { ...data };

    // Normalizar tipos y números
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

    // codigoBarras si existe -> trim
    if (clean.codigoBarras) {
      clean.codigoBarras = String(clean.codigoBarras).trim();
    } else {
      delete clean.codigoBarras;
    }

    onSubmit(clean);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCleanSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
          className="space-y-4"
        >
          {/* CODIGO DE BARRAS */}
          <div>
            <Label>Código de barras</Label>
            <Input
              {...register("codigoBarras")}
              placeholder="Opcional: escaneá o pegá el código"
            />
          </div>

          {/* NOMBRE */}
          <div>
            <Label>Nombre</Label>
            <Input {...register("nombre", { required: true })} />
          </div>

          {/* TIPO */}
          <div className="flex items-center gap-1">
            <Label>Tipo</Label>
            <Tooltip text="Unitario: 1 producto por venta | Peso: se vende por kg | Pack: varios productos juntos" />
          </div>
          <Select
            defaultValue={initialData?.tipo || "unitario"}
            onValueChange={(v) => setValue("tipo", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="unitario">Unitario</SelectItem>
              <SelectItem value="peso">Por peso</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>

          {/* PRECIOS */}
          {tipo !== "pack" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-1">
                <Label>Precio Compra</Label>
                <Tooltip text="Costo por unidad o kilo. Se usa para calcular ganancia." />
              </div>
              <Input type="number" step="0.01" {...register("precioCompra")} />

              <div className="flex items-center gap-1">
                <Label>Precio Venta</Label>
                <Tooltip text="Precio de venta al cliente por unidad o kilo." />
              </div>
              <Input type="number" step="0.01" {...register("precioVenta")} />
            </div>
          )}

          {tipo === "pack" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-1">
                <Label>Unidades por Pack</Label>
                <Tooltip text="Cantidad de productos que contiene el pack" />
              </div>
              <Input type="number" {...register("unidadPorPack")} />

              <div className="flex items-center gap-1">
                <Label>Precio Compra Pack</Label>
                <Tooltip text="Costo total del pack. Se divide por unidades para calcular costo unitario" />
              </div>
              <Input type="number" {...register("precioCompraPack")} />

              <div className="flex items-center gap-1">
                <Label>Precio Venta Unidad</Label>
                <Tooltip text="Precio de venta de cada unidad dentro del pack" />
              </div>
              <Input type="number" {...register("precioVenta")} />
            </div>
          )}

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
          <Input {...register("foto")} />

          {/* DESCRIPCIÓN */}
          <div className="flex items-center gap-1">
            <Label>Descripción</Label>
            <Tooltip text="Opcional. Información adicional sobre el producto" />
          </div>
          <Textarea rows={3} {...register("descripcion")} />

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData && initialData._id ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
