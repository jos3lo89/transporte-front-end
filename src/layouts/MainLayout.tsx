import MainNavBar from "@/components/MainNavBar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <header>
        <MainNavBar></MainNavBar>
      </header>
      <aside>aside bar</aside>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default MainLayout;
