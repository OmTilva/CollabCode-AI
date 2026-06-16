import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

import { logout } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const clearAuth = useAuthStore((state) => state.logout);

  const logoutMutation = useMutation({
    mutationFn: logout,

    onSuccess: () => {
      clearAuth();

      toast.success("Logged out successfully");

      navigate("/login");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Logout failed");

        return;
      }

      toast.error("Logout failed");
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};
