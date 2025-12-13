import Swal from "sweetalert2";
const generarCodigo = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/products/${productId}/generar-codigo`
    );

    setFormData({
      ...formData,
      codigoBarras: res.data.codigoBarras,
    });

    Swal.fire("Código generado", "", "success");
  } catch (err) {
    Swal.fire("Error al generar código", "", "error");
  }
};
