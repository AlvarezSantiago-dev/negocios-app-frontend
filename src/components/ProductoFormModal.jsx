import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import MoneyInput from "@/components/MoneyInput";
import { formatMoney } from "@/services/dashboardService";

export default function ProductoFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  onPrint,
}) {
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const tipo = watch("tipo");

  /* ---------- valores numéricos ---------- */
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
          <div>
            <Label>Código de barras</Label>
            <Input {...register("codigoBarras")} placeholder="Opcional" />
          </div>

          {/* Nombre */}
          <div>
            <Label>Nombre</Label>
            <Input {...register("nombre", { required: true })} />
          </div>

          {/* Tipo */}
          <div>
            <Label>Tipo</Label>
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
          </div>

          {/* Unitario / Peso */}
          {tipo !== "pack" && (
            <>
              <MoneyInput
                value={watch("precioCompra")}
                placeholder="Precio compra"
                onChange={(v) => setValue("precioCompra", v)}
              />
              <MoneyInput
                value={watch("precioVenta")}
                placeholder="Precio venta"
                onChange={(v) => setValue("precioVenta", v)}
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
                {...register("unidadPorPack")}
                placeholder="Unidades por pack"
              />
              <MoneyInput
                value={watch("precioCompraPack")}
                placeholder="Costo del pack"
                onChange={(v) => setValue("precioCompraPack", v)}
              />
              <MoneyInput
                value={watch("precioVenta")}
                placeholder="Venta por unidad"
                onChange={(v) => setValue("precioVenta", v)}
              />

              {gananciaPackUnidad > 0 && (
                <div className="text-sm text-green-600">
                  Ganancia estimada por unidad: $
                  {formatMoney(gananciaPackUnidad)}
                </div>
              )}
            </>
          )}

          {/* Categoría */}
          <div>
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
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stock</Label>
              <Input {...register("stock")} />
            </div>
            <div>
              <Label>Stock mínimo</Label>
              <Input {...register("stockMinimo")} />
            </div>
          </div>

          {/* Foto */}
          <div>
            <Label>Foto URL</Label>
            <Input {...register("foto")} />
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción</Label>
            <Textarea rows={3} {...register("descripcion")} />
          </div>

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
