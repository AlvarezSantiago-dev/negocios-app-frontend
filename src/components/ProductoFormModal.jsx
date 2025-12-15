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
                     w-56 bg-gray-800 text-white text-xs rounded px-3 py-2
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
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const [packs, setPacks] = useState([]);
  const precioCompra = watch("precioCompra") || "";
  const precioVenta = watch("precioVenta") || "";

  const gananciaUnitario =
    Number(precioVenta) > 0 && Number(precioCompra) > 0
      ? Number(precioVenta) - Number(precioCompra)
      : 0;

  useEffect(() => {
    reset(
      initialData || {
        nombre: "",
        categoria: "general",
        tipo: "unitario", // valor por defecto
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

  /* ---------- Packs handlers ---------- */
  const addPack = () =>
    setPacks([...packs, { unidades: "", precioVentaPack: "" }]);
  const updatePack = (index, field, value) => {
    const updated = [...packs];
    updated[index][field] = value;
    setPacks(updated);
  };
  const removePack = (index) => setPacks(packs.filter((_, i) => i !== index));

  /* ---------- Submit ---------- */
  const handleCleanSubmit = (data) => {
    const clean = {
      nombre: data.nombre.trim(),
      categoria: data.categoria,
      tipo: data.tipo, // ahora se guarda correctamente
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

  /* ---------- Generar código ---------- */
  const generarCodigo = async () => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/generate-barcode`
    );
    setValue("codigoBarras", res.data.codigoBarras, { shouldDirty: true });
  };

  const gananciaUnitaria =
    precioCompra > 0 && precioVenta > 0 ? precioVenta - precioCompra : 0;

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
          {/* ---------- COLUMNA IZQUIERDA ---------- */}
          <div className="space-y-4">
            {/* Código de barras */}
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
              <Label>Tipo de producto</Label>
              <Select
                defaultValue={initialData?.tipo || "unitario"}
                onValueChange={(v) => setValue("tipo", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unitario">Unitario</SelectItem>
                  <SelectItem value="peso">Peso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Precio compra */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Precio compra
                <Tooltip text="Costo unitario del producto." />
              </Label>
              <MoneyInput
                value={precioCompra}
                onChange={(v) => setValue("precioCompra", v)}
              />
            </div>

            {/* Precio venta */}
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Precio venta unitario
                <Tooltip text="Precio al vender una sola unidad." />
              </Label>
              <MoneyInput
                value={precioVenta}
                onChange={(v) => setValue("precioVenta", v)}
              />
            </div>

            {/* Ganancia unitaria */}
            {gananciaUnitaria > 0 && (
              <div className="text-sm text-green-600">
                Ganancia unitaria: ${formatMoney(gananciaUnitaria)}
              </div>
            )}

            {/* Categoría */}
            <div className="space-y-1">
              <Label>Categoría</Label>
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
          </div>

          {/* ---------- COLUMNA DERECHA ---------- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Packs (opcional)</h3>
              <Tooltip text="Configuraciones de precio por cantidad. El sistema compara rentabilidad automáticamente." />
            </div>

            {packs.map((pack, i) => {
              const unidades = Number(pack.unidades) || 0;
              const precioPack = Number(pack.precioVentaPack) || 0;

              const gananciaPack =
                unidades > 0 && precioPack > 0 && precioCompra > 0
                  ? precioPack - precioCompra * unidades
                  : 0;

              const gananciaUnidadNormal = gananciaUnitaria * unidades;

              const packMenosRentable =
                gananciaPack > 0 &&
                gananciaUnidadNormal > 0 &&
                gananciaPack < gananciaUnidadNormal;

              return (
                <div
                  key={i}
                  className={`grid grid-cols-3 gap-2 items-center p-2 rounded border
                  ${
                    packMenosRentable
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="space-y-1">
                    <Label>Unidades</Label>
                    <Input
                      type="number"
                      value={pack.unidades}
                      onChange={(e) =>
                        updatePack(i, "unidades", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
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

                  {/* Info pack */}
                  {gananciaPack > 0 && (
                    <div className="col-span-3 text-xs">
                      <span className="text-green-600">
                        Ganancia pack: ${formatMoney(gananciaPack)}
                      </span>

                      {packMenosRentable && (
                        <div className="text-red-600 mt-1">
                          ⚠ Este pack es menos rentable que vender unidades
                          sueltas (${formatMoney(gananciaUnidadNormal)})
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
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  Stock
                  <Tooltip text="Cantidad disponible en unidades." />
                </Label>
                <Input type="number" {...register("stock")} />
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  Stock mínimo
                  <Tooltip text="Se usa como alerta de reposición." />
                </Label>
                <Input type="number" {...register("stockMinimo")} />
              </div>
            </div>

            {/* Foto */}
            <div className="space-y-1">
              <Label>Foto (URL)</Label>
              <Input {...register("foto")} />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
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
