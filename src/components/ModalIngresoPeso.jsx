import { useForm } from "react-hook-form";
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

/**
 * ModalIngresoPeso
 *
 * Se usa cuando el producto es tipo "peso".
 * Permite ingresar los kilos vendidos y calcula el total.
 */
export default function ModalIngresoPeso({
  open,
  onClose,
  producto,
  onConfirm,
}) {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      peso: "",
    },
  });

  const peso = Number(watch("peso") || 0);
  const precioKg = producto?.precioVenta || 0;
  const total = peso * precioKg;

  const submit = (data) => {
    const kilos = Number(data.peso);
    if (kilos <= 0) return;

    onConfirm({
      productoId: producto._id,
      nombre: producto.nombre,
      tipo: "peso",
      peso: kilos,
      precioKg,
      total,
    });

    +onConfirm(kilos);

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Ingresar peso</DialogTitle>
        </DialogHeader>

        {producto && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-800">{producto.nombre}</p>
              <p>Precio por kg: ${precioKg}</p>
            </div>

            <form onSubmit={handleSubmit(submit)} className="space-y-3">
              <div className="space-y-1">
                <Label>Kilos vendidos</Label>
                <Input
                  type="number"
                  step="0.001"
                  autoFocus
                  {...register("peso", { required: true })}
                  placeholder="Ej: 0.750"
                />
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Agregar</Button>
              </DialogFooter>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
