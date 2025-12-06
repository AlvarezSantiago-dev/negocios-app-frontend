// Productos.js
import { useEffect, useState } from "react";
import useProductsStore from "../store/productsStore";
import ProductosTable from "../components/ProductosTable";
import ProductoFormModal from "../components/ProductoFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Productos() {
  const {
    products,
    fetchProducts,
    addProduct,
    removeProduct,
    updateProduct,
    loading,
  } = useProductsStore();

  const { toast } = useToast();

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateProduct(editing._id, data);
        toast({
          title: "Producto actualizado",
          description: `${data.nombre} fue modificado correctamente.`,
        });
      } else {
        await addProduct(data);
        toast({
          title: "Producto creado",
          description: `${data.nombre} fue agregado correctamente.`,
        });
      }
      setOpenModal(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar.",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeProduct(id);
      toast({
        title: "Producto eliminado",
        description: "El producto fue eliminado.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Productos</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="bg-[#63b0cd] hover:bg-[#559bb4] text-white"
            onClick={() => {
              setEditing(null);
              setOpenModal(true);
            }}
          >
            Nuevo Producto
          </Button>
        </motion.div>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-xs">
        <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-100 p-2 gap-2">
          <Search size={18} className="text-gray-400" />
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none shadow-none focus:ring-0"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
        <ProductosTable
          products={filtered}
          loading={loading}
          onEdit={(p) => {
            setEditing(p);
            setOpenModal(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* MODAL */}
      <ProductoFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  );
}
