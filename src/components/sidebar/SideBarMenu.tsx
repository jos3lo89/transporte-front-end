import { useState } from "react";
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";
import { sideBarData } from "@/components/sidebar/data-access/sideBar.data";

const SideBarMenu = () => {
  const [activeTeam] = useState(sideBarData.empresa);
  return (
    <SidebarMenu>
      <SidebarMenuButton size="lg">
        <div className="flex aspect-square size-16 items-center justify-center rounded-lg ">
          {/* <activeTeam.logo className="size-9" /> */}
          <img
            src="https://res.cloudinary.com/ddqdwtsn6/image/upload/v1733772269/transportes/logo-transporte_gkjief.png"
            alt="logo de la empresa"
          />
          {/* <img src="logo-transporte.png" alt="logo de la empresa" /> */}
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{activeTeam.name}</span>
          <span className="truncate text-xs">{activeTeam.plan}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenu>
  );
};
export default SideBarMenu;
