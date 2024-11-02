import { Roles } from "@/enums/auth.enum";
import { useAuthStore } from "@/store/auth.store";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type Props = PropsWithChildren<{
  allowedRoles: Roles[];
}>;

const RoleGuard = ({ children, allowedRoles }: Props) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};
export default RoleGuard;
