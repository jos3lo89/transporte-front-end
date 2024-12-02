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

  goDashboard: {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },

  navMain: [
    {
      title: "Procesos",
      url: "#",
      icon: Bot,
      isActive: false,

      items: [
        // {
        //   title: "Venta de boletos",
        //   url: "/venta-boletos",
        // },
        // {
        //   title: "Encomiendas",
        //   url: "#",
        // },
        // {
        //   title: "Consultar encomienda",
        //   url: "#",
        // },

        {
          title: "Hora de salida",
          url: "/hora-salida",
        },
      ],
    },
    {
      title: "Registros",
      url: "#",
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
        // {
        //   title: "Asignar vehiculo",
        //   url: "#",
        // },
        {
          title: "Rutas y paradas",
          url: "/rutas-paradas",
        },
        {
          title: "Registro personal",
          url: "/registro-personal",
        },
        // {
        //   title: "Registrar serie de boletos",
        //   url: "#",
        // },
      ],
    },
    // {
    //   title: "Reportes",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "Boletos",
    //       url: "#",
    //     },
    //     {
    //       title: "Saldo",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Administrador",
      url: "#",
      icon: Settings2,
      items: [
        // {
        //   title: "Roles y permisos",
        //   url: "#",
        // },

        {
          title: "Listar empleados",
          url: "/lista-empleados",
        },
        {
          title: "Crear Rutas",
          url: "/crear-rutas",
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
