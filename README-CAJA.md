# 💰 CajaPage - Documentación

## Descripción General

CajaPage es el módulo principal de gestión de caja del sistema. Permite controlar la apertura y cierre de caja, registrar movimientos de ingresos y egresos, y visualizar las ventas del día.

## Características Principales

### 🎨 Diseño Modernizado

- **Gradientes vibrantes**: Fondos con degradados suaves de gris-azul-morado
- **Animaciones Framer Motion**: Transiciones suaves y efectos hover
- **Cards con sombras**: Diseño elevado con rounded-2xl
- **Responsive design**: Adaptable a mobile, tablet y desktop

### 📊 Componentes Visuales

#### MetricCardCaja

Tarjetas de métricas con:

- 4 esquemas de color (blue, green, purple, orange)
- Gradientes en borde superior
- Íconos contextuales (Wallet, DollarSign, Smartphone, CreditCard)
- Valores destacados en grande
- Subtítulos descriptivos
- Animaciones de hover (levanta -5px)

#### ActionButton

Botones de acción con:

- 3 variantes: primary (azul-morado), success (verde-esmeralda), danger (rojo-rosa)
- Gradientes en fondo
- Efectos scale en hover/tap
- Estado disabled con opacidad
- Íconos integrados

#### Estado de Caja

Card especial que muestra:

- Estado visual con gradiente verde (abierta) o rojo (cerrada)
- Ícono CheckCircle (abierta) o XCircle (cerrada)
- Botones para: Abrir Caja, Cerrar Caja, Nuevo Movimiento
- Validaciones de estado (no se puede cerrar si ya está cerrada, etc.)

### 📈 Métricas KPI

Muestra 4 tarjetas con los totales:

1. **Total en Caja** (azul) - Wallet icon
2. **Efectivo** (verde) - DollarSign icon
3. **MercadoPago** (morado) - Smartphone icon
4. **Transferencias** (naranja) - CreditCard icon

### 📊 Resumen de Movimientos

2 Cards horizontales que muestran:

- **Total Ingresos** (verde) con TrendingUp icon
- **Total Egresos** (rojo) con TrendingDown icon
- Contadores de cantidad de movimientos

### 📋 Tablas

#### Tabla de Movimientos

- Lista todos los movimientos (ingresos/egresos)
- Permite editar y eliminar
- Ordenada por fecha
- Filtros por tipo

#### Tabla de Ventas

- Lista todas las ventas del día
- Permite editar y eliminar
- Muestra productos, métodos de pago, totales
- Información detallada por venta

### 🔄 Modales

1. **AperturaModal**: Para abrir la caja con montos iniciales
2. **CierreModal**: Para cerrar caja con conteo final
3. **MovimientoFormModal**: Crear/editar movimientos
4. **VentaFormModal**: Editar ventas (no crear desde aquí)

## Tecnologías Utilizadas

- **React** con hooks (useState, useEffect)
- **Zustand** para estado global (useCajaStore)
- **Framer Motion** para animaciones
- **Lucide React** para iconografía
- **Tailwind CSS** para estilos
- **Servicios**: cajaService, dashboardService

## Store: useCajaStore

### Estado

```javascript
{
  ventasTodas: [],        // Todas las ventas del día
  resumen: {              // Resumen de caja
    total: 0,
    efectivo: 0,
    mp: 0,
    transferencia: 0,
    abierta: false,
    aperturaHoy: false,
    cierreHoy: false
  },
  allmovimientos: [],     // Todos los movimientos
  loading: false,
  loadingCierre: false,
  cerrando: false,
  cierreHoy: null        // Datos del cierre de hoy
}
```

### Acciones

- `fetchCaja()`: Obtiene resumen de caja y movimientos
- `crearMovimiento(data)`: Crea nuevo movimiento
- `editarMovimiento(id, data)`: Edita movimiento existente
- `eliminarMovimiento(id)`: Elimina movimiento
- `abrirCaja(montos)`: Abre la caja con montos iniciales
- `cerrarCaja(montos)`: Cierra la caja con conteo final
- `fetchCierreData()`: Obtiene datos del cierre para el modal
- `eliminarVenta(id)`: Elimina una venta
- `editarVenta(id, data)`: Edita una venta
- `fetchVentas()`: Obtiene todas las ventas

## Flujo de Uso

1. **Al cargar la página**:

   - Se ejecuta `fetchCaja()` para obtener el resumen
   - Se ejecuta `fetchCierreData()` para ver si hay cierre pendiente
   - Se ejecuta `fetchVentas()` para obtener ventas del día

2. **Abrir Caja**:

   - Click en "Abrir Caja"
   - Modal solicita montos iniciales (efectivo, mp, transferencia)
   - Al confirmar, se llama a `abrirCaja(montos)`
   - Se actualiza el estado y las métricas

3. **Registrar Movimiento**:

   - Click en "Nuevo Movimiento" (solo si caja abierta)
   - Modal solicita: tipo (ingreso/egreso), monto, método, motivo
   - Al guardar, se llama a `crearMovimiento(data)`
   - Se actualiza la tabla de movimientos

4. **Editar Movimiento**:

   - Click en "Editar" en la tabla
   - Se abre modal con datos precargados
   - Al guardar, se llama a `editarMovimiento(id, data)`

5. **Cerrar Caja**:

   - Click en "Cerrar Caja" (solo si abierta y no cerrada hoy)
   - Modal muestra conteo esperado vs real
   - Al confirmar, se llama a `cerrarCaja(montos)`
   - Se genera el cierre del día

6. **Gestionar Ventas**:
   - Se pueden editar ventas desde la tabla
   - Se pueden eliminar ventas (afecta totales)
   - No se crean ventas desde esta página (se crean en Ventas.jsx)

## Validaciones

- No se puede abrir si ya hay apertura hoy
- No se puede cerrar si la caja no está abierta
- No se puede cerrar si ya hay cierre hoy
- No se pueden crear movimientos si la caja está cerrada
- Botones disabled cuando hay loading

## Estilos y Animaciones

### Gradientes utilizados

```css
- Estado Caja Abierta: from-green-50 to-emerald-50
- Estado Caja Cerrada: from-red-50 to-orange-50
- Fondo general: from-gray-50 via-blue-50 to-purple-50
- Botón Primary: from-blue-600 to-purple-600
- Botón Success: from-green-600 to-emerald-600
- Botón Danger: from-red-600 to-pink-600
```

### Animaciones Framer Motion

```javascript
// Fade in + scale
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}

// Fade in + slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Hover lift
whileHover={{ y: -5 }}

// Button interactions
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

## Responsive Breakpoints

- **Mobile (< 640px)**: 1 columna, botones apilados
- **Tablet (640px - 1024px)**: 2 columnas en KPIs
- **Desktop (> 1024px)**: 4 columnas en KPIs, layout completo

## Integraciones

### Servicios API

```javascript
// dashboardService.js
- formatMoney(value): Formatea números a moneda

// cajaService.js (via store)
- GET /api/caja/resumen
- POST /api/caja/apertura
- POST /api/caja/cierre
- GET/POST/PUT/DELETE /api/movimientos
- GET/PUT/DELETE /api/ventas
```

## Mejoras Futuras Sugeridas

1. **Filtros avanzados**: Por rango de fechas, tipo de movimiento, método de pago
2. **Exportación**: PDF o Excel del resumen de caja
3. **Gráficos**: Chart de ingresos vs egresos por hora
4. **Notificaciones**: Alertas cuando hay diferencias en el cierre
5. **Historial**: Ver cierres de días anteriores
6. **Búsqueda**: Buscar movimientos por motivo o monto
7. **Totalizadores**: Estadísticas semanales/mensuales

## Notas de Desarrollo

- **Importante**: Los modales mantienen su propia lógica de estados (isOpen)
- **Dependencias**: Asegurarse que MovimientosTable y VentasTable estén actualizadas
- **Store**: useCajaStore debe estar correctamente inicializado
- **API**: Las rutas del backend deben estar configuradas en VITE_API_URL

## Ejemplo de Uso del Store

```javascript
import useCajaStore from "../store/useCajaStore";

function MyComponent() {
  const { resumen, fetchCaja, abrirCaja, crearMovimiento } = useCajaStore();

  useEffect(() => {
    fetchCaja();
  }, []);

  const handleOpenCash = async (amounts) => {
    await abrirCaja(amounts);
    fetchCaja(); // Refrescar
  };

  return (
    <div>
      <p>Total: ${resumen?.total || 0}</p>
      <p>Estado: {resumen?.abierta ? "Abierta" : "Cerrada"}</p>
    </div>
  );
}
```

## Troubleshooting

### Problema: La caja no se actualiza

- Verificar que `fetchCaja()` se ejecute después de acciones
- Revisar la consola por errores de red
- Verificar VITE_API_URL en .env

### Problema: No se pueden crear movimientos

- Verificar que la caja esté abierta (`resumen?.abierta === true`)
- Revisar permisos del usuario
- Verificar que no haya cierre del día

### Problema: Modal no se cierra

- Verificar que `onClose` esté correctamente vinculado
- Revisar estados loading/cerrando

---

**Última actualización**: Modernización completa con gradientes y animaciones
**Versión**: 2.0 (Modernizada)
**Mantenedor**: Sistema de Gestión de Negocios
