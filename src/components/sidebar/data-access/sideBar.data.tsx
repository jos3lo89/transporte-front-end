import {
  BookOpen,
  Bot,
  Bus,
  Frame,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";

export const sideBarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  empresa: {
    name: "El Apurimeño",
    logo: Bus,
    plan: "Empresa",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        // {
        //   title: "History",
        //   url: "#",
        // },
        // {
        //   title: "Starred",
        //   url: "#",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Procesos",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Venta de boletos",
          url: "#",
        },
        {
          title: "Encomiendas",
          url: "#",
        },
        {
          title: "Consultar encomienda",
          url: "#",
        },
        {
          title: "Crear ruta",
          url: "#",
        },
      ],
    },
    {
      title: "Registros",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Registrar vehículos",
          url: "#",
        },
        {
          title: "Asignar vehiculo",
          url: "#",
        },
        {
          title: "Rutas y paradas",
          url: "#",
        },
        {
          title: "Registrar serie de boletos",
          url: "#",
        },
      ],
    },
    {
      title: "Reportes",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Boletos",
          url: "#",
        },
        {
          title: "Saldo",
          url: "#",
        },
      ],
    },
    {
      title: "Administrador",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Roles y permisos",
          url: "#",
        },
        {
          title: "Registro personal",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};
