import { useAuthStore } from "@/store/auth.store";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

type Props = PropsWithChildren;

const AuthGuard = ({ children }: Props) => {
  const { isAuth } = useAuthStore();

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
};
export default AuthGuard;
