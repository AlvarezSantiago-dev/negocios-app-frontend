// src/components/ProductoFormModal.jsx
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
    <div className="relative inline-flex">
      <Info
        size={14}
        className="text-gray-400 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />

      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                     w-60 bg-gray-800 text-white text-xs rounded px-3 py-2
                     shadow-lg z-50"
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
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
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
    },
  });

  const [packs, setPacks] = useState([]);

  /* ---------- Watch ---------- */
  const tipo = watch("tipo");
  const categoria = watch("categoria");
  const precioCompra = Number(watch("precioCompra") || 0);
  const precioVenta = Number(watch("precioVenta") || 0);

  const gananciaUnitaria =
    precioCompra > 0 && precioVenta > 0 ? precioVenta - precioCompra : 0;

  /* ---------- Sync modal ---------- */
  useEffect(() => {
    if (!open) return;

    reset({
      nombre: initialData?.nombre ?? "",
      categoria: initialData?.categoria ?? "general",
      tipo: initialData?.tipo ?? "unitario",
      precioCompra: initialData?.precioCompra ?? "",
      precioVenta: initialData?.precioVenta ?? "",
      stock: initialData?.stock ?? "",
      stockMinimo: initialData?.stockMinimo ?? "",
      foto: initialData?.foto ?? "",
      descripcion: initialData?.descripcion ?? "",
      codigoBarras: initialData?.codigoBarras ?? "",
    });

    setPacks(initialData?.packs ?? []);
  }, [open, initialData, reset]);

  /* ---------- Packs ---------- */
  const addPack = () =>
    setPacks([...packs, { unidades: "", precioVentaPack: "" }]);

  const updatePack = (i, field, value) => {
    const updated = [...packs];
    updated[i][field] = value;
    setPacks(updated);
  };

  const removePack = (i) => setPacks(packs.filter((_, index) => index !== i));

  /* ---------- Submit ---------- */
  const handleCleanSubmit = (data) => {
    onSubmit({
      ...data,
      precioCompra: Number(data.precioCompra || 0),
      precioVenta: Number(data.precioVenta || 0),
      stock: Number(data.stock || 0),
      stockMinimo: Number(data.stockMinimo || 0),
      packs: packs
        .filter((p) => Number(p.unidades) > 0 && Number(p.precioVentaPack) > 0)
        .map((p) => ({
          unidades: Number(p.unidades),
          precioVentaPack: Number(p.precioVentaPack),
        })),
    });
  };

  /* ---------- Barcode ---------- */
  const generarCodigo = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/generate-barcode`
    );
    setValue("codigoBarras", res.data.codigoBarras, { shouldDirty: true });
  };

  /* ---------- Render ---------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl overflow-visible">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCleanSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* ---------- IZQUIERDA ---------- */}
          <div className="space-y-4">
            {/* Código barras */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Código de barras
                <Tooltip text="Podés ingresarlo manualmente o generarlo automáticamente." />
              </Label>
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

            {/* Nombre */}
            <div className="space-y-1">
              <Label>Nombre</Label>
              <Input {...register("nombre", { required: true })} />
            </div>

            {/* Tipo */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Tipo de producto
                <Tooltip text="Unitario: se vende por unidad. Peso: se vende por kilos/gramos desde balanza." />
              </Label>

              <Select value={tipo} onValueChange={(v) => setValue("tipo", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unitario">Unitario</SelectItem>
                  <SelectItem value="peso">Por peso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio compra */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Precio compra
                <Tooltip text="Costo del producto (por unidad o kilo según tipo)." />
              </Label>
              <MoneyInput
                value={precioCompra}
                onChange={(v) => setValue("precioCompra", v)}
              />
            </div>

            {/* Precio venta */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Precio venta
                <Tooltip text="Precio de venta unitario o por kilo." />
              </Label>
              <MoneyInput
                value={precioVenta}
                onChange={(v) => setValue("precioVenta", v)}
              />
            </div>

            {gananciaUnitaria > 0 && (
              <div className="text-sm text-green-600">
                Ganancia unitaria: ${formatMoney(gananciaUnitaria)}
              </div>
            )}

            {/* Categoría */}
            <div className="space-y-1">
              <Label>Categoría</Label>
              <Select
                value={categoria}
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
            </div>
          </div>

          {/* ---------- DERECHA ---------- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Packs (opcional)</h3>
              <Tooltip text="Precio especial por cantidad. El sistema avisa si es menos rentable." />
            </div>

            {packs.map((pack, i) => {
              const unidades = Number(pack.unidades || 0);
              const precioPack = Number(pack.precioVentaPack || 0);

              const gananciaPack =
                unidades > 0 && precioPack > 0
                  ? precioPack - precioCompra * unidades
                  : 0;

              const gananciaNormal = gananciaUnitaria * unidades;
              const menosRentable =
                gananciaPack > 0 && gananciaPack < gananciaNormal;

              return (
                <div
                  key={i}
                  className={`grid grid-cols-3 gap-2 items-center p-2 rounded border ${
                    menosRentable
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <Label>Unidades</Label>
                    <Input
                      type="number"
                      value={pack.unidades}
                      onChange={(e) =>
                        updatePack(i, "unidades", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Precio pack</Label>
                    <MoneyInput
                      value={pack.precioVentaPack}
                      onChange={(v) => updatePack(i, "precioVentaPack", v)}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removePack(i)}
                  >
                    <X size={16} />
                  </Button>

                  {gananciaPack > 0 && (
                    <div className="col-span-3 text-xs">
                      <span className="text-green-600">
                        Ganancia pack: ${formatMoney(gananciaPack)}
                      </span>

                      {menosRentable && (
                        <div className="text-red-600 mt-1">
                          ⚠ Menos rentable que vender suelto ($
                          {formatMoney(gananciaNormal)})
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <Button type="button" variant="secondary" onClick={addPack}>
              + Agregar pack
            </Button>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div>
                <Label>Stock</Label>
                <Input type="number" {...register("stock")} />
              </div>
              <div>
                <Label>Stock mínimo</Label>
                <Input type="number" {...register("stockMinimo")} />
              </div>
            </div>

            {/* Foto */}
            <div>
              <Label>Foto (URL)</Label>
              <Input {...register("foto")} />
            </div>

            {/* Descripción */}
            <div>
              <Label>Descripción</Label>
              <Textarea rows={3} {...register("descripcion")} />
            </div>
          </div>

          {/* ---------- FOOTER ---------- */}
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
