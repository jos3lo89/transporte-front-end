import { BookOpen, Bot, Bus, LayoutDashboard, Settings2 } from "lucide-react";

export const sideBarData = {
  empresa: {
    name: "El Apurimeño",
    logo: Bus,
    plan: "Empresa",
  },

  goDashboard: {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },

  navMain: [
    {
      title: "Procesos",
      url: "/procesos",
      icon: Bot,
      isActive: false,
      items: [
        {
          title: "Hora de salida",
          url: "/hora-salida",
        },
        {
          title: "Registrar encomienda",
          url: "/registro-encomienda",
        },
        {
          title: "Seguimiento encomienda",
          url: "/seguimiento-encomienda",
        },
      ],
    },
    {
      title: "Registros",
      url: "/registros",
      icon: BookOpen,
      items: [
        {
          title: "Registrar conductores",
          url: "/registro-conductores",
        },
        {
          title: "Registrar vehículos",
          url: "/registro-vehiculo",
        },
        {
          title: "Registrar personal",
          url: "/registro-personal",
        },
        {
          title: "Registrar Rutas",
          url: "/crear-rutas",
        },
      ],
    },
    {
      title: "Administrador",
      url: "/administrador", // Cambiar para que no sea #
      icon: Settings2,
      items: [
        {
          title: "Listar personal",
          url: "/lista-empleados",
        },
        {
          title: "Crear Terminales",
          url: "/crear-terminales",
        },
        {
          title: "Crear viaje",
          url: "/crear-viaje",
        },
      ],
    },
  ],
};
