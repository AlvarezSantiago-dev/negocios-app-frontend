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

import {
  Info,
  X,
  Barcode,
  Package,
  DollarSign,
  TrendingUp,
  Tag,
  Archive,
  Image,
  FileText,
  Plus,
  AlertTriangle,
  Printer,
} from "lucide-react";
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
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 bg-gradient-to-r from-blue-50 to-purple-50 -mx-6 -mt-6 px-6 pt-6 rounded-t-xl">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            {initialData ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCleanSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6"
        >
          {/* ---------- IZQUIERDA ---------- */}
          <div className="space-y-4">
            {/* Código barras */}
            <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Barcode className="w-5 h-5 text-blue-600" />
                Código de barras
                <Tooltip text="Podés ingresarlo manualmente o generarlo automáticamente." />
              </Label>
              <div className="flex gap-2">
                <Input
                  {...register("codigoBarras")}
                  className="bg-white border-blue-300 focus:border-blue-500"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generarCodigo}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Generar
                </Button>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Tag className="w-4 h-4 text-purple-600" />
                Nombre
              </Label>
              <Input
                {...register("nombre", { required: true })}
                className="border-gray-300 focus:border-purple-500"
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Package className="w-4 h-4 text-green-600" />
                Tipo de producto
                <Tooltip text="Unitario: se vende por unidad. Peso: se vende por kilos/gramos desde balanza." />
              </Label>

              <Select value={tipo} onValueChange={(v) => setValue("tipo", v)}>
                <SelectTrigger className="border-gray-300 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unitario">📦 Unitario</SelectItem>
                  <SelectItem value="peso">⚖️ Por peso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio compra */}
            <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <DollarSign className="w-5 h-5 text-orange-600" />
                Precio compra
                <Tooltip text="Costo del producto (por unidad o kilo según tipo)." />
              </Label>
              <MoneyInput
                value={precioCompra}
                onChange={(v) => setValue("precioCompra", v)}
                className="bg-white border-orange-300 focus:border-orange-500"
              />
            </div>

            {/* Precio venta */}
            <div className="space-y-2 p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Precio venta
                <Tooltip text="Precio de venta unitario o por kilo." />
              </Label>
              <MoneyInput
                value={precioVenta}
                onChange={(v) => setValue("precioVenta", v)}
                className="bg-white border-green-300 focus:border-green-500"
              />
            </div>

            {gananciaUnitaria > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300"
              >
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <TrendingUp className="w-5 h-5" />
                  Ganancia unitaria: ${formatMoney(gananciaUnitaria)}
                </div>
              </motion.div>
            )}

            {/* Categoría */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Archive className="w-4 h-4 text-blue-600" />
                Categoría
              </Label>
              <Select
                value={categoria}
                onValueChange={(v) => setValue("categoria", v)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">📋 General</SelectItem>
                  <SelectItem value="bebidas">🥤 Bebidas</SelectItem>
                  <SelectItem value="comida">🍔 Comida</SelectItem>
                  <SelectItem value="limpieza">🧹 Limpieza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ---------- DERECHA ---------- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-lg">Packs (opcional)</h3>
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`grid grid-cols-3 gap-2 items-center p-3 rounded-xl border-2 ${
                    menosRentable
                      ? "border-red-400 bg-gradient-to-br from-red-50 to-pink-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div>
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Unidades
                    </Label>
                    <Input
                      type="number"
                      value={pack.unidades}
                      onChange={(e) =>
                        updatePack(i, "unidades", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Precio pack
                    </Label>
                    <MoneyInput
                      value={pack.precioVentaPack}
                      onChange={(v) => updatePack(i, "precioVentaPack", v)}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removePack(i)}
                    className="mt-5 hover:bg-red-100 hover:text-red-600"
                  >
                    <X size={18} />
                  </Button>

                  {gananciaPack > 0 && (
                    <div className="col-span-3 mt-2 p-2 rounded-lg bg-white border">
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-semibold">
                          Ganancia pack: ${formatMoney(gananciaPack)}
                        </span>
                      </div>

                      {menosRentable && (
                        <div className="flex items-center gap-2 text-xs text-red-600 mt-1">
                          <AlertTriangle className="w-4 h-4" />
                          Menos rentable que vender suelto ($
                          {formatMoney(gananciaNormal)})
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={addPack}
              className="w-full border-purple-300 hover:bg-purple-50 text-purple-700 font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar pack
            </Button>

            {/* Stock */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="space-y-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <Label className="flex items-center gap-2 font-semibold">
                  <Archive className="w-4 h-4 text-blue-600" />
                  Stock
                </Label>
                <Input
                  type="number"
                  {...register("stock")}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
                <Label className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Stock mínimo
                </Label>
                <Input
                  type="number"
                  {...register("stockMinimo")}
                  className="bg-white"
                />
              </div>
            </div>

            {/* Foto */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <Image className="w-4 h-4 text-purple-600" />
                Foto (URL)
              </Label>
              <Input
                {...register("foto")}
                placeholder="https://..."
                className="border-gray-300 focus:border-purple-500"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-semibold">
                <FileText className="w-4 h-4 text-gray-600" />
                Descripción
              </Label>
              <Textarea
                rows={3}
                {...register("descripcion")}
                placeholder="Detalles adicionales del producto..."
                className="border-gray-300 focus:border-gray-500 resize-none"
              />
            </div>
          </div>

          {/* ---------- FOOTER ---------- */}
          <DialogFooter className="col-span-full border-t pt-4 flex flex-wrap gap-3">
            {initialData?._id && initialData?.codigoBarras && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onPrint(initialData)}
                className="border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir código
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              <Package className="w-4 h-4 mr-2" />
              {initialData ? "Guardar cambios" : "Crear producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
