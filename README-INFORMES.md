# 📊 Componentes de Informes - Documentación

## 🎨 Rediseño Completo de Informes

Se ha realizado una reestructuración completa de la página de informes con un diseño moderno, colorido y fácil de leer.

---

## 🆕 Nuevos Componentes

### 1. **StatCard**

`/src/components/informes/StatCard.jsx`

Tarjeta de estadística moderna con animaciones y colores personalizables.

**Props:**

- `title` (string): Título de la métrica
- `value` (string/number): Valor principal a mostrar
- `subtitle` (string): Subtítulo opcional
- `icon` (Component): Icono de Lucide React
- `trend` (object): Objeto con dirección ('up'/'down'), valor y label
- `color` (string): Color del tema ('blue', 'green', 'purple', 'orange', 'pink', 'indigo')

**Ejemplo:**

```jsx
<StatCard
  title="Ventas del Día"
  value="$15,420"
  subtitle="120 transacciones"
  icon={DollarSign}
  color="blue"
  trend={{ direction: "up", value: "+12%", label: "vs ayer" }}
/>
```

---

### 2. **ColorfulBarChart**

`/src/components/informes/ColorfulBarChart.jsx`

Gráfico de barras con colores vibrantes y animaciones suaves.

**Props:**

- `data` (array): Array de objetos con los datos
- `dataKey` (string): Clave del valor a graficar (default: 'value')
- `title` (string): Título del gráfico

**Ejemplo:**

```jsx
<ColorfulBarChart
  data={mensuales}
  dataKey="totalDia"
  title="Ventas Mensuales"
/>
```

---

### 3. **TrendChart**

`/src/components/informes/TrendChart.jsx`

Gráfico de tendencias con estilo área o línea.

**Props:**

- `data` (array): Array de objetos con fecha y valores
- `title` (string): Título del gráfico
- `type` (string): 'area' o 'line' (default: 'area')

**Ejemplo:**

```jsx
<TrendChart data={ultimos7Dias} title="Tendencia de Ventas" type="area" />
```

---

### 4. **DataTable**

`/src/components/informes/DataTable.jsx`

Tabla de datos moderna con animaciones y estado vacío elegante.

**Props:**

- `title` (string): Título de la tabla
- `headers` (array): Array de strings con los encabezados
- `data` (array): Array de objetos con los datos
- `renderRow` (function): Función que renderiza cada fila

**Ejemplo:**

```jsx
<DataTable
  title="Ventas Diarias"
  headers={["Hora", "Total", "Método"]}
  data={ventas}
  renderRow={(venta) => (
    <>
      <td>{venta.hora}</td>
      <td>${venta.total}</td>
      <td>{venta.metodo}</td>
    </>
  )}
/>
```

---

### 5. **DateRangeSelector**

`/src/components/informes/DateRangeSelector.jsx`

Selector de fechas con presets rápidos.

**Props:**

- `selectedDate` (string): Fecha seleccionada en formato ISO
- `onDateChange` (function): Callback cuando cambia la fecha

**Ejemplo:**

```jsx
<DateRangeSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
```

---

## 🎯 Características Principales

### ✨ Diseño Visual

- **Colores vibrantes**: Paleta de 8 colores para gráficos
- **Gradientes modernos**: De azul a púrpura en elementos principales
- **Sombras suaves**: Shadow-lg para profundidad
- **Bordes redondeados**: rounded-2xl para un look moderno
- **Animaciones**: Entrada suave con Framer Motion

### 📊 Gráficos Mejorados

- **Barras coloridas**: Cada barra tiene un color único
- **Tooltips personalizados**: Diseño limpio con información relevante
- **Área con gradiente**: Efecto visual atractivo
- **Grid suave**: Líneas de cuadrícula discretas

### 📱 Responsive

- **Mobile-first**: Optimizado para dispositivos móviles
- **Grid adaptativo**: Se ajusta automáticamente al tamaño de pantalla
- **Scroll horizontal**: En tabs para mejor UX mobile

### 🎨 UI/UX Mejorada

- **3 pestañas organizadas**: General, Ventas, Productos
- **Filtro de fechas**: Con presets (Hoy, Ayer, Última semana, Este mes)
- **Estado de carga**: Spinner elegante con mensaje
- **Estado vacío**: Diseño amigable cuando no hay datos
- **Badges coloridos**: Para métodos de pago y categorías

---

## 📐 Estructura de la Página

```
Informes.jsx
├── Header (Título + Botón Actualizar)
├── DateRangeSelector (Filtro de fechas)
├── KPI Cards (4 tarjetas de métricas)
│   ├── Ventas del Día
│   ├── Ganancia del Día
│   ├── Ganancia Mensual
│   └── Productos Vendidos
├── Tabs Navigation
│   ├── 📊 General
│   ├── 🛒 Ventas
│   └── 📦 Productos
└── Tab Content
    ├── General: TrendChart + ColorfulBarChart
    ├── Ventas: DataTable con detalle de ventas
    └── Productos: DataTable con ganancias por producto
```

---

## 🎨 Paleta de Colores

```javascript
const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#f97316", // orange
];
```

---

## 🚀 Mejoras Implementadas

### Antes ❌

- Gráficos simples sin color
- Sin filtros de fecha
- Tabs poco visuales
- Tablas básicas sin estilo
- KPIs simples sin contexto

### Después ✅

- Gráficos coloridos y animados
- Selector de fechas con presets
- Tabs con iconos y gradientes
- Tablas elegantes con badges y barras de progreso
- KPIs con iconos, colores y métricas adicionales

---

## 📦 Dependencias Utilizadas

- **Recharts**: Gráficos
- **Framer Motion**: Animaciones
- **Lucide React**: Iconos
- **Tailwind CSS**: Estilos

---

## 💡 Uso Recomendado

1. **Desarrollo**: Los componentes son reutilizables
2. **Personalización**: Cambiar colores en el array COLORS
3. **Extensión**: Agregar nuevos tipos de gráficos fácilmente
4. **Performance**: Los gráficos son optimizados con ResponsiveContainer

---

## 🐛 Notas

- Los gráficos se adaptan automáticamente al tamaño del contenedor
- Las animaciones tienen duración de 800ms-1000ms
- Los tooltips muestran valores formateados
- El selector de fechas limita hasta hoy
- Las tablas muestran un estado vacío elegante

---

## 📸 Preview

La página ahora tiene:

- 🎨 Diseño moderno con gradientes azul-púrpura
- 📊 Gráficos coloridos y fáciles de leer
- 📱 Totalmente responsive
- ⚡ Animaciones suaves
- 🎯 Información clara y organizada
