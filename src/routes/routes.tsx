import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import {
  CrearRutasPage,
  CrearTerminalesPage,
  CrearViaje,
  HoraSalida,
  ListaEmpleados,
  Login,
  ProfilePage,
  RegistrarVehiculo,
  RegistroConductores,
  RegistroPersonal,
  RutasParadas,
  VentaBoletos,
} from ".";
import { Suspense } from "react";
import NotFound from "@/pages/NotFound";
import AuthGuard from "@/guards/AuthGuard";
import RoleGuard from "@/guards/RoleGuard";
import { Roles } from "@/enums/auth.enum";
import Loading from "@/components/Loading";

const routes = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE, Roles.BOLETERO]}>
              <Dashboard />
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/registro-personal",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <RegistroPersonal />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE, Roles.BOLETERO]}>
              <Suspense fallback={<Loading />}>
                <ProfilePage />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/lista-empleados",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <ListaEmpleados />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/registro-conductores",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <RegistroConductores />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/registro-vehiculo",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <RegistrarVehiculo />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/rutas-paradas",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <RutasParadas />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/crear-viaje",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <CrearViaje />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/venta-boletos/:idviaje",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <VentaBoletos />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/hora-salida",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE, Roles.BOLETERO]}>
              <Suspense fallback={<Loading />}>
                <HoraSalida />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/crear-rutas",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <CrearRutasPage />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/crear-terminales",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.GERENTE]}>
              <Suspense fallback={<Loading />}>
                <CrearTerminalesPage />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
