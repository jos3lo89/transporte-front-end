import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { sideBarData } from "@/components/sidebar/data-access/sideBar.data";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/enums/auth.enum";

const SideBarItems = () => {
  const { user } = useAuthStore();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Opciones</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuSubButton asChild>
            <NavLink to={sideBarData.goDashboard.url}>
              {sideBarData.goDashboard.icon && <sideBarData.goDashboard.icon />}
              <span>{sideBarData.goDashboard.title}</span>
            </NavLink>
          </SidebarMenuSubButton>
        </SidebarMenuItem>

        {user &&
          sideBarData.navMain.map((item) => {
            // Lógica para mostrar solo los elementos permitidos según el rol
            if (user.role === Roles.GERENTE) {
              return (
                <Collapsible
                  key={item.url}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items?.length !== 0 && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton asChild>
                              <NavLink to={subItem.url}>
                                <span>{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Lógica para Boletero: solo ver "Hora de salida" en "Procesos"
            if (user.role === Roles.BOLETERO && item.title === "Procesos") {
              return (
                <Collapsible
                  key={item.url}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items?.length !== 0 && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items
                          ?.filter(
                            (subItem) => subItem.title === "Hora de salida"
                          )
                          .map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            // Lógica para Encomendero: solo ver "Registrar encomienda" y "Seguimiento encomienda" en "Procesos"
            if (user.role === Roles.ENCOMENDERO && item.title === "Procesos") {
              return (
                <Collapsible
                  key={item.url}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items?.length !== 0 && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items
                          ?.filter(
                            (subItem) =>
                              subItem.title === "Registrar encomienda" ||
                              subItem.title === "Seguimiento encomienda"
                          )
                          .map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton asChild>
                                <NavLink to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return null;
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
export default SideBarItems;
