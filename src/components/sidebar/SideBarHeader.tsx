import { ModeToggle } from "../mode-toggle";
import { SidebarTrigger } from "../ui/sidebar";

const SideBarHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center w-full justify-between gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <ModeToggle />
      </div>
    </header>
  );
};

export default SideBarHeader;
