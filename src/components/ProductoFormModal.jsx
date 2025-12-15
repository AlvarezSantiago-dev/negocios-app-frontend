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

import { Info, X } from "lucide-react";
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

  /* ---------------- state ---------------- */
  const [packs, setPacks] = useState([]);

  /* ---------------- watch ---------------- */
  const precioCompra = watch("precioCompra") || "";
  const precioVenta = watch("precioVenta") || "";

  /* ---------------- cálculos ---------------- */
  const gananciaUnitario =
    Number(precioVenta) > 0 && Number(precioCompra) > 0
      ? Number(precioVenta) - Number(precioCompra)
      : 0;

  /* ---------------- efectos ---------------- */
  useEffect(() => {
    reset(
      initialData || {
        nombre: "",
        categoria: "general",
        tipo: "unitario",
        precioCompra: "",
        precioVenta: "",
        stock: "",
        stockMinimo: "",
        foto: "",
        descripcion: "",
        codigoBarras: "",
      }
    );

    setPacks(initialData?.packs || []);
  }, [initialData, reset]);

  /* ---------------- packs handlers ---------------- */
  const addPack = () => {
    setPacks([...packs, { unidades: "", precioVentaPack: "" }]);
  };

  const updatePack = (index, field, value) => {
    const updated = [...packs];
    updated[index][field] = value;
    setPacks(updated);
  };

  const removePack = (index) => {
    setPacks(packs.filter((_, i) => i !== index));
  };

  /* ---------------- submit ---------------- */
  const handleCleanSubmit = (data) => {
    const clean = {
      nombre: data.nombre.trim(),
      categoria: data.categoria,
      tipo: data.tipo,

      precioCompra: Number(data.precioCompra || 0),
      precioVenta: Number(data.precioVenta || 0),

      stock: Number(data.stock || 0),
      stockMinimo: Number(data.stockMinimo || 0),

      foto: data.foto || "",
      descripcion: data.descripcion || "",
      codigoBarras: data.codigoBarras || undefined,

      packs: packs
        .filter((p) => Number(p.unidades) > 0 && Number(p.precioVentaPack) > 0)
        .map((p) => ({
          unidades: Number(p.unidades),
          precioVentaPack: Number(p.precioVentaPack),
        })),
    };

    onSubmit(clean);
  };

  /* ---------------- generar código ---------------- */
  const generarCodigo = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/generate-barcode`
    );

    setValue("codigoBarras", res.data.codigoBarras, {
      shouldDirty: true,
    });
  };

  /* ---------------- render ---------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCleanSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* --------- COLUMNA IZQUIERDA --------- */}
          <div className="space-y-4">
            {/* Código barras */}
            <div className="space-y-1">
              <Label>Código de barras</Label>
              <div className="flex gap-2">
                <Input {...register("codigoBarras")} />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generarCodigo}
                >
                  Generar
                </Button>
              </div>
            </div>

            <Input
              {...register("nombre", { required: true })}
              placeholder="Nombre"
            />

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
                Ganancia unitaria: ${formatMoney(gananciaUnitario)}
              </div>
            )}

            <Select
              defaultValue={initialData?.categoria || "general"}
              onValueChange={(v) => setValue("categoria", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="bebidas">Bebidas</SelectItem>
                <SelectItem value="comida">Comida</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* --------- COLUMNA DERECHA --------- */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">Packs (opcional)</h3>
              <Tooltip text="Configuraciones de precio por cantidad" />
            </div>

            {packs.map((pack, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Unidades"
                  value={pack.unidades}
                  onChange={(e) => updatePack(i, "unidades", e.target.value)}
                />

                <MoneyInput
                  placeholder="Precio pack"
                  value={pack.precioVentaPack}
                  onChange={(v) => updatePack(i, "precioVentaPack", v)}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removePack(i)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={addPack}>
              + Agregar pack
            </Button>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Input type="number" {...register("stock")} placeholder="Stock" />
              <Input
                type="number"
                {...register("stockMinimo")}
                placeholder="Stock mínimo"
              />
            </div>

            <Input {...register("foto")} placeholder="Foto URL (opcional)" />

            <Textarea
              rows={3}
              {...register("descripcion")}
              placeholder="Descripción"
            />
          </div>

          {/* --------- FOOTER --------- */}
          <DialogFooter className="col-span-full">
            {initialData?._id && initialData?.codigoBarras && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onPrint(initialData)}
              >
                Imprimir código
              </Button>
            )}

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
