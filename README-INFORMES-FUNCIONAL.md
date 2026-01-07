# 📊 Informes - Funcionalidades Completas

## 🎯 Descripción General

Sistema completo de informes con análisis de ventas, ganancias y productos. Incluye visualizaciones interactivas, desglose detallado y estados vacíos elegantes.

---

## ✅ Funcionalidades Implementadas

### 1. 📈 KPI Cards (4 métricas principales)

- ✅ **Ventas del Día**: Total + número de transacciones
- ✅ **Ganancia del Día**: Ganancia + margen porcentual
- ✅ **Ganancia Mensual**: Total + productos vendidos
- ✅ **Productos Vendidos**: Cantidad de productos diferentes

### 2. 📑 Sistema de Tabs

#### Tab: General

- ✅ Gráfico de tendencia (últimos 7 días) - Área chart
- ✅ Gráfico de barras colorido (últimos 15 días del mes)

#### Tab: Ventas

- ✅ Tabla detallada de ventas del día seleccionado
- ✅ Columnas: Hora, Items, Total, Método Pago, Ganancia
- ✅ Badges coloreados por método de pago
- ✅ Estado vacío cuando no hay ventas

#### Tab: Productos

- ✅ **NUEVO**: Gráfico Top 8 Productos por Ganancia
- ✅ Tabla con desglose completo por producto
- ✅ Medalla para Top 3 productos
- ✅ Barra de progreso visual por porcentaje
- ✅ Estado vacío cuando no hay datos

### 3. 🔄 Funcionalidades Adicionales

- ✅ Selector de fecha con calendario
- ✅ Botón de actualización manual
- ✅ Loading state elegante
- ✅ Animaciones con Framer Motion
- ✅ Responsive design (móvil, tablet, desktop)

---

## 🔌 APIs y Endpoints

### Frontend Service (`informesService.js`)

```javascript
fetchVentasDiarias(fechaISO)          // GET /ventas/informes/diarias?fecha=
fetchVentasMensuales(year, month)     // GET /ventas/informes/mensuales?year=&month=
fetchGanancias(year, month, day?)     // GET /ventas/informes/ganancias?year=&month=
fetchUltimos7Dias()                   // GET /ventas/informes/ultimos-7-dias
```

### Backend Routes (`ventas.api.js`)

```javascript
GET / ventas / informes / ultimos - 7 - dias;
GET / ventas / informes / diarias;
GET / ventas / informes / mensuales;
GET / ventas / informes / ganancias;
```

---

## 🗄️ Estructura de Datos

### Respuesta de Ganancias (ACTUALIZADA)

```json
{
  "ganancias": {
    "totalGanado": 15000,
    "totalVendido": 50000,
    "cantidadVentas": 45,
    "totalProductos": 12,
    "detalles": [
      {
        "_id": "ObjectId",
        "nombre": "Coca Cola 2L",
        "cantidadVendida": 50,
        "gananciaUnitaria": 150,
        "gananciaTotal": 7500,
        "totalVendidoProducto": 15000
      }
    ]
  }
}
```

### Respuesta de Ventas Diarias

```json
{
  "ventas": {
    "fecha": "2026-01-07",
    "ventas": [
      {
        "_id": "ObjectId",
        "fecha": "2026-01-07T15:30:00Z",
        "items": [...],
        "totalVenta": 2500,
        "gananciaTotal": 750,
        "metodoPago": "Efectivo"
      }
    ],
    "totalVendido": 5000,
    "gananciaTotal": 1500,
    "cantidadVentas": 2
  }
}
```

---

## 🛠️ Mejoras Implementadas en Backend

### Repository (`ventas.rep.js`)

**Agregación de productos mejorada:**

```javascript
// ANTES: Solo totales generales
{ totalGanado, totalVendido, cantidadVentas }

// AHORA: Totales + desglose por producto
{
  totalGanado,
  totalVendido,
  cantidadVentas,
  totalProductos,    // ← NUEVO
  detalles: [        // ← NUEVO
    {
      nombre,
      cantidadVendida,
      gananciaUnitaria,
      gananciaTotal,
      totalVendidoProducto
    }
  ]
}
```

**Pipeline MongoDB:**

1. `$unwind` items
2. `$lookup` para obtener datos del producto
3. `$group` por productoId con agregaciones
4. `$sort` por gananciaTotal descendente

---

## 🎨 Componentes de UI

### StatCard

- Props: title, value, subtitle, icon, color
- Colores: blue, green, purple, orange
- Animación hover: elevación
- Barra superior con gradiente

### ColorfulBarChart

- 8 colores rotativos
- Tooltips personalizados
- Barras con bordes redondeados
- Animación de entrada (800ms)

### TrendChart

- Tipos: area / line
- Gradiente en área
- Grid con líneas discontinuas
- Responsive container

### DataTable

- Headers personalizables
- renderRow function para cada fila
- Estado vacío con icono y mensaje
- Animaciones stagger para filas

### DateRangeSelector

- Input type="date"
- Icono de calendario
- Valor por defecto: hoy
- Formato ISO (YYYY-MM-DD)

---

## 🎯 Validaciones y Estados Vacíos

### Tab Ventas

```jsx
{(diarias.ventas ?? []).length === 0 ? (
  <EmptyState icon={ShoppingCart} message="No hay ventas" />
) : (
  <DataTable ... />
)}
```

### Tab Productos

```jsx
{(ganancias.detalles ?? []).length === 0 ? (
  <EmptyState icon={AlertCircle} message="No hay datos" />
) : (
  <>
    <ColorfulBarChart ... />  // Top 8
    <DataTable ... />          // Detalle completo
  </>
)}
```

---

## 📊 Visualizaciones

### Gráfico Top 8 Productos

- Toma los 8 productos con mayor ganancia
- Colores rotativos de paleta
- Muestra nombre + ganancia total
- Ordenado descendente

### Tabla de Productos

- Todas las filas con datos completos
- Top 3 con medalla dorada
- Barra de progreso proporcional
- Porcentaje sobre total

---

## 🚀 Flujo de Carga de Datos

1. **useEffect** dispara `cargar()` al cambiar fecha
2. **Promise.all** ejecuta 4 fetch en paralelo:
   - Ventas diarias
   - Ventas mensuales
   - Ganancias (con detalles de productos)
   - Últimos 7 días
3. **Loading state** mientras se cargan datos
4. **Estados actualizados** con resultados
5. **UI se renderiza** con datos frescos

---

## 🎨 Paleta de Colores

### Gradientes principales:

- **Fondo página**: `from-gray-50 via-blue-50 to-purple-50`
- **Azul**: `from-blue-500 to-blue-600`
- **Verde**: `from-green-500 to-green-600`
- **Púrpura**: `from-purple-500 to-purple-600`
- **Naranja**: `from-orange-500 to-orange-600`

### Gráficos (8 colores):

```javascript
[
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#14b8a6",
  "#f97316",
];
```

---

## 📱 Responsive Design

- **Desktop**: Grid 4 columnas para KPIs, gráficos full width
- **Tablet**: Grid 2 columnas para KPIs, gráficos adaptados
- **Móvil**: Stack vertical, tablas con scroll horizontal

---

## 🔮 Mejoras Futuras Sugeridas

- [ ] Exportar a PDF/Excel
- [ ] Filtro de rango de fechas personalizado
- [ ] Comparación entre períodos
- [ ] Gráfico de torta para métodos de pago
- [ ] Alertas de productos de bajo rendimiento
- [ ] Proyecciones y forecasting
- [ ] Dashboard personalizable (drag & drop)
- [ ] Notificaciones de metas alcanzadas

---

## 🧪 Testing Recomendado

1. Verificar datos sin ventas (estados vacíos)
2. Probar con diferentes fechas
3. Validar cálculos de porcentajes
4. Responsive en diferentes dispositivos
5. Performance con muchos productos
6. Manejo de errores de red

---

## 📝 Notas Importantes

- **Zona Horaria**: UTC-3 (Argentina)
- **Formato Fechas**: ISO 8601 (YYYY-MM-DD)
- **Ganancia**: Calculada como (precioVenta - precioCompra) \* cantidad
- **MongoDB**: Usa aggregation pipelines para performance
- **Recharts**: Versión debe ser compatible con React 18+
