import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { useAuth } from "@/hooks/auth/use-auth";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { isLoading } = useAuth();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
