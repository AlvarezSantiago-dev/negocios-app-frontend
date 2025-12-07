import { useState } from "react";
import {
  fetchCajaResumen,
  fetchCajaMovimientos,
  crearMovimientoCaja,
  editarMovimientoCaja,
  eliminarMovimientoCaja,
  aperturaCaja,
  cierreCaja,
  fetchCierres,
  fetchCierreHoy,
} from "../services/cajaService";

export default function useCajaStore() {
  const [resumen, setResumen] = useState({});
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCierre, setLoadingCierre] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  const [cierres, setCierres] = useState([]);
  const [cierreHoy, setCierreHoy] = useState(null);

  const fetchCierreData = async () => {
    try {
      const hoy = await fetchCierreHoy();
      setCierreHoy(hoy);

      const todos = await fetchCierres();
      setCierres(todos);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCaja = async () => {
    setLoading(true);
    try {
      const resResumen = await fetchCajaResumen();
      setResumen({
        efectivo: resResumen.efectivo ?? 0,
        mp: resResumen.mp ?? 0,
        transferencia: resResumen.transferencia ?? 0,
        total: resResumen.total ?? 0,
        aperturaHoy: resResumen.aperturaHoy ?? false,
        cierreHoy: resResumen.cierreHoy ?? false,
        abierta: resResumen.abierta ?? false,
      });
      const resMovs = await fetchCajaMovimientos();
      setMovimientos(resMovs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crearMovimiento = async (data) => {
    setLoading(true);
    try {
      await crearMovimientoCaja(data);
      await fetchCaja();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editarMovimiento = async (id, data) => {
    setLoading(true);
    try {
      await editarMovimientoCaja(id, data);
      await fetchCaja();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarMovimiento = async (id) => {
    setLoading(true);
    try {
      await eliminarMovimientoCaja(id);
      await fetchCaja();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const abrirCaja = async (
    montos = { efectivo: 0, mp: 0, transferencia: 0 }
  ) => {
    setLoading(true);
    try {
      await aperturaCaja(montos); // llama backend
    } catch (err) {
      console.error(err);
    } finally {
      await fetchCaja(); // ⚡ siempre sincronizamos con backend
      setLoading(false);
    }
  };

  const cerrarCaja = async (
    montos = { efectivo: 0, mp: 0, transferencia: 0 }
  ) => {
    if (resumen?.cierreHoy) return; // ⚡ si ya hay cierre, ni lo intenta

    setCerrando(true);
    setLoadingCierre(true);
    try {
      await cierreCaja(montos); // backend
    } catch (err) {
      console.error(err);
    } finally {
      await fetchCaja(); // ⚡ sincroniza siempre
      setCerrando(false);
      setLoadingCierre(false);
    }
  };

  return {
    resumen,
    movimientos,
    fetchCaja,
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    abrirCaja,
    cerrarCaja,
    loading,
    loadingCierre,
    cerrando,
    fetchCierreData,
    cierreHoy,
    cierres,
  };
}
