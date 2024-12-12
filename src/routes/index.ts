import { lazy } from "react";

export const Login = lazy(() => import("@/pages/auth/Login"));
export const RegistroPersonal = lazy(
  () => import("@/pages/empleados/RegistroPersonal")
);
export const ProfilePage = lazy(() => import("@/pages/miPerfil/ProfilePage"));
export const ListaEmpleados = lazy(
  () => import("@/pages/empleados/ListaEmpleados")
);
export const RegistroConductores = lazy(
  () => import("@/pages/conductores/RegistroConductores")
);
export const RegistrarVehiculo = lazy(
  () => import("@/pages/vehiculos/RegistrarVehiculo")
);
export const RutasParadas = lazy(() => import("@/pages/rutas/RutasParadas"));
export const CrearViaje = lazy(() => import("@/pages/viajes/CrearViaje"));
export const VentaBoletos = lazy(
  () => import("@/pages/ventaBoletos/VentaBoletos")
);
export const HoraSalida = lazy(() => import("@/pages/horaSalida/HoraSalida"));
export const CrearRutasPage = lazy(
  () => import("@/pages/crearRutas/CrearRutas")
);

export const CrearTerminalesPage = lazy(
  () => import("@/pages/crearTerminales/CrearTerminales")
);

export const RegistroEncomiendaPage = lazy(
  () => import("@/pages/registroEncomienda/RegistroEncomiendaPage")
);

export const SeguimientoEncomiendaPage = lazy(
  () => import("@/pages/seguimientoEncomienda/SeguimientoEcomiendaPage")
);

export const EncomiendaDetallesPage = lazy(
  () => import("@/pages/encomiendaDetalles/EcomiendaDetallesPage")
);
