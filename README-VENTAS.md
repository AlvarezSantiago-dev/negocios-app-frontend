# 🛒 Ventas Page - Documentación

## Descripción General

Ventas.jsx es el módulo de punto de venta (POS) del sistema. Permite registrar ventas en tiempo real, gestionar el carrito de compras, escanear códigos de barras y generar tickets automáticos.

## Características Principales

### 🎨 Diseño Modernizado

- **Gradientes vibrantes**: Fondos con degradados gris-azul-morado
- **Animaciones Framer Motion**: Transiciones suaves y efectos hover
- **Layout de 2 columnas**: Productos a la izquierda, carrito a la derecha
- **Responsive design**: Adaptable a mobile, tablet y desktop
- **Estados visuales**: Empty states, loading, alertas de stock

### 📊 Componentes Visuales

#### ActionButton

Botones de acción con:

- 3 variantes: primary (azul-morado), success (verde), danger (rojo)
- Gradientes en fondo
- Efectos scale en hover/tap
- Estado disabled con opacidad
- Íconos integrados

### 🏷️ Escáner de Código de Barras

**Banner Informativo:**

- Gradiente verde-esmeralda
- Ícono de código de barras
- Mensaje sobre scanner activo

**Funcionalidad:**

- Siempre activo en la página
- Busca producto por código
- **Si existe**: Agrega al carrito automáticamente
- **Si no existe**: Abre modal para crear nuevo producto
- Inter-char timeout: 60ms

### 📦 Panel de Productos

**Header:**

- Gradiente azul-morado
- Ícono Package
- Título "Productos Disponibles"

**Buscador:**

- Input con ícono Search
- Filtrado en tiempo real
- Placeholder: "Buscar producto..."

**Lista de Productos:**

- ScrollArea con altura fija (600px)
- Cards con hover azul
- Información por producto:
  - Nombre en negrita
  - Precio en verde ($)
  - Stock con color según nivel (rojo si crítico)
  - Botón (+) con gradiente azul-morado
- Empty state si no hay resultados

### 🛒 Panel de Carrito

**Header:**

- Gradiente verde-esmeralda
- Ícono ShoppingCart
- Badge con cantidad de items

**Lista de Items:**

- ScrollArea con altura máxima (400px)
- Cards por item con:
  - Nombre del producto
  - Badge "Pack aplicado" si corresponde
  - Controles de cantidad (-, input, +)
  - Precio total por item
  - Botón eliminar (basura roja)
- Empty state con ilustración

**Footer:**

- Selector de método de pago con íconos
- Total en card grande con gradiente azul-morado
- Botón "Registrar Venta" verde con CheckCircle

### 💳 Métodos de Pago

1. **Efectivo** - DollarSign icon
2. **Mercado Pago** - Smartphone icon
3. **Transferencia** - CreditCard icon

Cada método tiene su ícono y se muestra en el selector.

### 🎯 Sistema de Packs

**Lógica automática:**

- Al cambiar cantidad, revisa si hay pack disponible
- Si cantidad coincide con pack: aplica precio especial
- Muestra badge "Pack aplicado" en verde
- Calcula precio unitario del pack automáticamente

**Función `resolverPrecio`:**

```javascript
resolverPrecio(producto, cantidad) {
  // Busca pack que coincida con cantidad
  // Si existe: devuelve precio unitario del pack
  // Si no: devuelve precio unitario normal
}
```

### ⚖️ Productos por Peso

**Flujo especial:**

1. Usuario selecciona producto tipo "peso"
2. Abre modal `ModalIngresoPeso`
3. Usuario ingresa kilogramos
4. Se agrega al carrito con cantidad = peso
5. Precio se calcula: `precio × peso`

## Flujo de Uso

### 1. Cargar Productos

```javascript
useEffect(() => {
  cargarProductos();
}, []);
```

- Obtiene todos los productos disponibles
- Muestra loading mientras carga
- Guarda en state `products`

### 2. Buscar Productos

- Usuario escribe en input
- `setFiltro(value)`
- Array `productosFiltrados` se actualiza en tiempo real
- Muestra solo coincidencias

### 3. Agregar al Carrito (Manual)

- Usuario hace click en botón (+)
- **Producto normal**: agrega 1 unidad
- **Producto peso**: abre modal de peso
- **Sin stock**: muestra alerta
- Si ya existe en carrito: aumenta cantidad

### 4. Agregar por Escáner

- Scanner detecta código
- Busca producto en API: `GET /products/barcode/:codigo`
- **Encontrado**: ejecuta `agregarAlCarrito(producto)`
- **No encontrado**: pregunta si crear nuevo

### 5. Modificar Cantidad

- Botones (+) y (-) o input directo
- Valida stock disponible
- Recalcula precio con packs
- Actualiza total automáticamente

### 6. Eliminar del Carrito

- Click en botón basura roja
- Remueve item del carrito
- Recalcula total

### 7. Registrar Venta

- Valida carrito no vacío
- Construye payload:
  ```javascript
  {
    metodoPago: "efectivo|mp|transferencia",
    items: [
      { productoId: "...", cantidad: 1 }
    ]
  }
  ```
- POST a `/ventas`
- Muestra SweetAlert con éxito
- Abre ticket en nueva pestaña
- Limpia carrito
- Recarga productos

### 8. Crear Producto (desde scanner)

- Si código no existe
- SweetAlert pregunta si crear
- Abre `ProductoFormModal` con código precargado
- Usuario completa datos
- POST a `/products`
- Recarga productos
- SweetAlert de confirmación

## Tecnologías Utilizadas

- **React** con hooks (useState, useEffect)
- **Axios** para peticiones HTTP
- **SweetAlert2** para alertas y confirmaciones
- **Framer Motion** para animaciones
- **Lucide React** para iconografía
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes base
- **Custom Hook**: useBarcodeScanner

## Estados Manejados

```javascript
const [products, setProducts] = useState([]); // Todos los productos
const [filtro, setFiltro] = useState(""); // Búsqueda
const [carrito, setCarrito] = useState([]); // Items en carrito
const [metodoPago, setMetodoPago] = useState("efectivo"); // Método seleccionado
const [openModal, setOpenModal] = useState(false); // Modal crear producto
const [initialProductData, setInitialProductData] = useState(null); // Data para modal
const [openPesoModal, setOpenPesoModal] = useState(false); // Modal peso
const [productoPesoActual, setProductoPesoActual] = useState(null); // Producto peso
const [isLoading, setIsLoading] = useState(true); // Carga inicial
```

## Estructura del Item en Carrito

```javascript
{
  productoId: "abc123",              // ID del producto
  nombre: "Coca Cola 2L",            // Nombre para mostrar
  cantidad: 6,                        // Unidades o kg
  tipoVenta: "pack",                  // "unidad" | "pack" | "peso"
  precioUnitarioAplicado: 850,        // Precio por unidad (puede ser de pack)
  stock: 100                          // Stock disponible
}
```

## API Endpoints

```javascript
// Productos
GET    /products                      // Obtener todos
GET    /products/barcode/:codigo      // Buscar por código
POST   /products                      // Crear nuevo

// Ventas
POST   /ventas                        // Registrar venta
{
  metodoPago: "efectivo",
  items: [{ productoId: "...", cantidad: 1 }]
}

// Respuesta incluye:
{
  response: {
    _id: "...",
    ticketUrl: "/tickets/venta-123.pdf",
    ...
  }
}
```

## Validaciones

- Carrito no puede estar vacío al registrar venta
- No se puede agregar más cantidad que stock disponible
- Cantidad mínima: 1
- Productos sin stock no se pueden agregar (excepto peso)
- Código de barras debe ser único al crear

## Estilos y Animaciones

### Gradientes

```css
- Fondo general: from-gray-50 via-blue-50 to-purple-50
- Banner scanner: from-green-50 to-emerald-50
- Panel productos header: from-blue-50 to-purple-50
- Panel carrito header: from-green-50 to-emerald-50
- Botón agregar: from-blue-600 to-purple-600
- Total card: from-blue-600 to-purple-600
- Botón registrar: from-green-600 to-emerald-600
```

### Animaciones Framer Motion

```javascript
// Fade in + slide up (header)
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}

// Fade in + slide left (productos)
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}

// Fade in + slide right (carrito)
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}

// Staggered items
transition={{ delay: i * 0.02 }}

// Button interactions
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Item add/remove
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
```

## Responsive Breakpoints

- **Mobile (< 1024px)**: Layout vertical (productos arriba, carrito abajo)
- **Desktop (> 1024px)**: Layout horizontal (2 columnas)
- ScrollArea se adapta en ambos casos

## Mejoras Futuras Sugeridas

1. **Historial de ventas**: Tabla con ventas del día
2. **Estadísticas**: Total vendido, método más usado
3. **Descuentos**: Aplicar descuentos manuales o cupones
4. **Cliente**: Asociar venta a un cliente
5. **Devoluciones**: Anular ventas con motivo
6. **Caja cerrada**: Validar que caja esté abierta
7. **Imprimir sin abrir**: Opción de reimprimir ticket
8. **Teclado numérico**: Para ingresar cantidades rápido
9. **Favoritos**: Productos más vendidos destacados
10. **Multi-moneda**: Soporte para dólares u otras

## Notas de Desarrollo

### Hook useBarcodeScanner

```javascript
useBarcodeScanner({
  onScan: (codigo) => {
    /* buscar y agregar */
  },
  enabled: true, // Siempre activo en ventas
  interCharTimeout: 60, // 60ms entre caracteres
});
```

### Performance

- Filtrado optimizado con `includes`
- Animaciones limitadas (delay × 0.02)
- ScrollArea para listas grandes
- Recarga productos solo cuando necesario

### SweetAlert2

```javascript
// Confirmación
const result = await Swal.fire({
  title: "...",
  text: "...",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Sí",
});

if (result.isConfirmed) {
  // acción
}

// Éxito temporal
Swal.fire({
  title: "Venta registrada",
  icon: "success",
  showConfirmButton: false,
  timer: 1500,
});
```

### Apertura de Ticket

```javascript
// Después de registrar venta
if (venta.ticketUrl) {
  setTimeout(() => {
    window.open(
      `${import.meta.env.VITE_API_BACK_URL}${venta.ticketUrl}`,
      "_blank"
    );
  }, 1000);
}
```

## Troubleshooting

### Problema: Scanner no funciona

- Verificar que `enabled: true`
- Comprobar `interCharTimeout` adecuado
- Revisar que no haya otros listeners

### Problema: No se aplica precio de pack

- Verificar que `packs` esté en el producto
- Comprobar que cantidad coincida exactamente
- Revisar función `resolverPrecio`

### Problema: Ticket no se abre

- Verificar `VITE_API_BACK_URL` en .env
- Comprobar que backend genere `ticketUrl`
- Revisar bloqueador de popups del navegador

### Problema: Stock no se actualiza

- Verificar que backend descuente stock al vender
- Llamar `cargarProductos()` después de venta
- Revisar respuesta de API

### Problema: Total incorrecto

- Verificar cálculo: `Σ(precio × cantidad)`
- Comprobar que `precioUnitarioAplicado` sea correcto
- Revisar que no haya valores null/undefined

---

**Última actualización**: Modernización completa con gradientes y animaciones
**Versión**: 2.0 (Modernizada)
**Mantenedor**: Sistema de Gestión de Negocios
