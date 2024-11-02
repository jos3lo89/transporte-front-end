import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/Dashboard";
import { Login, RegistroPersonal } from ".";
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
            <RoleGuard allowedRoles={[Roles.ADMINISTRADOR, Roles.VENDEDOR]}>
              <Dashboard />
            </RoleGuard>
          </AuthGuard>
        ),
      },
      {
        path: "/registro-personal",
        element: (
          <AuthGuard>
            <RoleGuard allowedRoles={[Roles.ADMINISTRADOR]}>
              <Suspense fallback={<Loading />}>
                <RegistroPersonal />
              </Suspense>
            </RoleGuard>
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
