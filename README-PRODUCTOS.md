# 📦 Products Page - Documentación

## Descripción General

Products.jsx es el módulo de gestión de inventario del sistema. Permite crear, editar y eliminar productos, controlar stock, gestionar precios y códigos de barras con escáner integrado.

## Características Principales

### 🎨 Diseño Modernizado

- **Gradientes vibrantes**: Fondos con degradados gris-azul-morado
- **Animaciones Framer Motion**: Transiciones suaves y efectos hover
- **Cards elevadas**: Diseño con rounded-2xl y sombras
- **Responsive design**: Adaptable a todos los dispositivos
- **Empty states**: Estados vacíos con ilustraciones y mensajes

### 📊 Componentes Visuales

#### StatCard

Tarjetas de estadísticas con:

- 4 esquemas de color (blue, green, orange, red)
- Gradientes en borde superior
- Íconos contextuales
- Valores destacados en grande
- Subtítulos descriptivos
- Animaciones de hover (levanta -5px)

#### ActionButton

Botones de acción con:

- 2 variantes: primary (azul-morado), secondary (gris)
- Gradientes en fondo
- Efectos scale en hover/tap
- Estado disabled con opacidad
- Íconos integrados

### 📈 Estadísticas en Tiempo Real

Muestra 4 tarjetas KPI:

1. **Total Productos** (azul) - Package icon
2. **Stock Crítico** (rojo) - AlertTriangle icon
3. **Valor Inventario** (verde) - TrendingUp icon
4. **Ganancia Potencial** (naranja) - TrendingUp icon

Cálculos:

- Total Productos: `products.length`
- Stock Crítico: Productos donde `stock <= stockMinimo`
- Valor Inventario: `Σ(precioCompra × stock)`
- Ganancia Potencial: `Σ((precioVenta - precioCompra) × stock)`

### 🔍 Buscador Inteligente

- Input con ícono de búsqueda
- Filtrado en tiempo real por nombre
- Contador de resultados dinámico
- Diseño con sombra y border animado

### 🏷️ Escáner de Código de Barras

**Banner Informativo:**

- Gradiente azul-morado
- Ícono de código de barras
- Mensaje informativo sobre scanner activo

**Funcionalidad:**

- Activo cuando modal está cerrado
- Si código existe: abre modal con producto para editar
- Si código no existe: abre modal para crear nuevo producto
- Inter-char timeout: 60ms
- Hook personalizado: `useBarcodeScanner`

### 📋 Tabla de Productos Moderna

**Características visuales:**

- Headers con texto uppercase y tracking-wide
- Filas con hover gradient (azul-morado)
- Animaciones staggered (delay incremental)
- Badges para packs
- Alertas visuales de stock

**Columnas:**

1. **Producto**

   - Ícono Package con gradiente
   - Nombre en negrita
   - Código de barras en gris (o "Sin código")

2. **Compra**

   - Precio en negrita
   - "Costo unitario" en gris

3. **Venta**

   - Ícono TrendingUp verde
   - Precio unitario con unidad (kg/u)
   - Badges azules para packs con precios

4. **Stock**

   - Alertas con íconos:
     - Rojo + AlertCircle: Stock crítico (≤ mínimo)
     - Naranja: Stock bajo (≤ 2× mínimo)
     - Verde: Stock normal
   - Valor en grande con decimales según tipo
   - Mensaje "¡Stock crítico!" o "Stock bajo"

5. **Acciones**
   - Botón Editar: azul con Pencil icon
   - Botón Eliminar: rojo con Trash2 icon
   - Efectos scale en hover/tap

### 🔄 Estados de Carga

**Loading (inicial):**

- Pantalla completa con gradiente
- Loader2 animado
- Mensaje "Cargando productos..."

**Loading (tabla):**

- Spinner en centro de tabla
- Mensaje "Cargando productos..."

**Empty State:**

- Ícono Package grande en gris
- Título "No hay productos"
- Mensaje descriptivo
- Fondo gris claro redondeado

## Modales

### ProductoFormModal

Modal para crear/editar productos:

- Campos: nombre, código, categoría, tipo, precios, stock
- Soporte para productos unitarios y por peso
- Gestión de packs (múltiples unidades)
- Validaciones en tiempo real
- Botón imprimir etiquetas

### PrintBarcodeModal

Modal para imprimir códigos de barras:

- Generación de código de barras
- Opciones de cantidad y tamaño
- Vista previa antes de imprimir
- Integración con jsPDF

## Tecnologías Utilizadas

- **React** con hooks (useState, useEffect)
- **Zustand** para estado global (useProductsStore)
- **Framer Motion** para animaciones
- **Lucide React** para iconografía
- **Tailwind CSS** para estilos
- **Custom Hook**: useBarcodeScanner

## Store: useProductsStore

### Estado

```javascript
{
  products: [],           // Array de productos
  loading: false,        // Estado de carga
  error: null           // Errores
}
```

### Acciones

- `fetchProducts()`: Obtiene todos los productos
- `addProduct(data)`: Crea nuevo producto
- `updateProduct(id, data)`: Actualiza producto existente
- `removeProduct(id)`: Elimina producto
- `searchProducts(query)`: Busca productos (opcional)

## Flujo de Uso

### 1. Cargar Productos

```javascript
useEffect(() => {
  fetchProducts();
}, []);
```

### 2. Crear Producto Nuevo

- Click en "Nuevo Producto"
- Se limpia `editing` (null)
- Se abre modal vacío
- Usuario completa datos
- `handleSubmit` → `addProduct(data)`
- Toast de confirmación

### 3. Editar Producto Existente

- Click en botón editar (lápiz azul)
- Se carga producto en `editing`
- Se abre modal con datos
- Usuario modifica
- `handleSubmit` → `updateProduct(id, data)`
- Toast de confirmación

### 4. Escanear Código de Barras

- Scanner detecta código
- Busca en `products` por `codigoBarras`
- **Existe**: carga en `editing` + abre modal (edición)
- **No existe**: crea objeto parcial + abre modal (creación)

### 5. Eliminar Producto

- Click en botón eliminar (basura roja)
- Llama `handleDelete(id)`
- `removeProduct(id)`
- Toast de confirmación o error

### 6. Buscar Productos

- Usuario escribe en input
- `setSearch(value)`
- `filtered` se actualiza en tiempo real
- Muestra contador de resultados

### 7. Imprimir Etiquetas

- Desde modal de producto
- Click en botón imprimir
- Abre `PrintBarcodeModal`
- Usuario configura cantidad/tamaño
- Genera PDF con etiquetas

## Validaciones

- Código de barras único (validado en backend)
- Precio venta > precio compra (recomendado)
- Stock mínimo > 0
- Nombres no vacíos
- Precios numéricos positivos

## Estilos y Animaciones

### Gradientes

```css
- Fondo general: from-gray-50 via-blue-50 to-purple-50
- Banner scanner: from-blue-50 to-purple-50
- Botón Primary: from-blue-600 to-purple-600
- Botón Secondary: from-gray-600 to-gray-700
- Hover tabla: from-blue-50 to-purple-50
- Ícono producto: from-blue-100 to-purple-100
```

### Animaciones Framer Motion

```javascript
// Fade in + scale
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}

// Fade in + slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Hover lift (cards)
whileHover={{ y: -5 }}

// Button interactions
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Staggered rows
transition={{ delay: i * 0.03 }}
```

## Responsive Breakpoints

- **Mobile (< 640px)**: 1 columna, tabla scroll horizontal
- **Tablet (640px - 1024px)**: 2 columnas en stats
- **Desktop (> 1024px)**: 4 columnas en stats, tabla completa

## Integraciones

### API Endpoints

```javascript
// productsService.js
GET    /api/products           // Obtener todos
POST   /api/products           // Crear nuevo
PUT    /api/products/:id       // Actualizar
DELETE /api/products/:id       // Eliminar
GET    /api/products/search    // Buscar (opcional)
```

### Tipos de Producto

**Unitario:**

- Stock en unidades enteras
- Ejemplo: Botellas, latas, cajas
- Formato stock: `123 u`

**Por Peso:**

- Stock en kilogramos con decimales
- Ejemplo: Frutas, verduras, granos
- Formato stock: `12.450 kg`

### Sistema de Packs

Permite vender agrupaciones con precio especial:

```javascript
packs: [
  { unidades: 6, precioVentaPack: 5000 },
  { unidades: 12, precioVentaPack: 9500 },
];
```

**Lógica:**

- Precio base: venta individual
- Packs: descuento por cantidad
- Se calculan automáticamente en ventas

## Mejoras Futuras Sugeridas

1. **Filtros avanzados**: Por categoría, rango de precio, stock
2. **Ordenamiento**: Por nombre, precio, stock
3. **Vista grid**: Alternativa a tabla con cards
4. **Importación**: CSV/Excel de productos masivos
5. **Exportación**: Reporte de inventario en PDF/Excel
6. **Historial**: Log de cambios de precios/stock
7. **Imágenes**: Fotos de productos
8. **Categorías**: Gestión dinámica de categorías
9. **Proveedores**: Vincular productos con proveedores
10. **Códigos QR**: Alternativa a códigos de barras

## Notas de Desarrollo

### Hook useBarcodeScanner

```javascript
useBarcodeScanner({
  onScan: (codigo) => {
    /* callback */
  },
  enabled: !openModal, // Desactivar cuando modal abierto
  interCharTimeout: 60, // ms entre caracteres
});
```

**Importante:**

- Solo un scanner activo por página
- Desactivar cuando hay inputs con foco
- Timeout ajustable según hardware

### Performance

- Animaciones staggered limitadas (max 0.03s × índice)
- Tabla virtualizada para > 1000 productos (considerar)
- Búsqueda debounced para muchos productos

### Accesibilidad

- Títulos en botones (title attribute)
- Colores con suficiente contraste
- Keyboard navigation en tabla
- Screen reader friendly

## Troubleshooting

### Problema: Scanner no funciona

- Verificar que `enabled: !openModal`
- Revisar `interCharTimeout` (aumentar si scanner lento)
- Comprobar que no hay otros listeners de teclado

### Problema: Productos no se cargan

- Verificar `fetchProducts()` en useEffect
- Revisar VITE_API_URL en .env
- Comprobar errores en consola

### Problema: Stock crítico no se muestra

- Verificar que `stockMinimo` esté configurado
- Comparar `stock <= stockMinimo`
- Revisar cálculo en componente

### Problema: Búsqueda no filtra

- Verificar que `filtered` use `search.toLowerCase()`
- Comprobar que tabla recibe `filtered` no `products`

---

**Última actualización**: Modernización completa con gradientes y animaciones
**Versión**: 2.0 (Modernizada)
**Mantenedor**: Sistema de Gestión de Negocios
