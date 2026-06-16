import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const data = await getMe();

      setUser(data.user);

      return data.user;
    },

    retry: false,
  });
};
