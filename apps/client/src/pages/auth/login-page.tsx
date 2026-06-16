import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { login, getMe } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginFormValues } from "./auth.schema";
import { AuthLayout } from "@/app/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const LoginPage = () => {
  const navigate = useNavigate();

  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: async () => {
      const me = await getMe();

      setUser(me.user);

      toast.success("Login successful");

      navigate("/dashboard");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Login failed");

        return;
      }

      toast.error("Login failed");
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>

          <p className="text-muted-foreground">Login to continue.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

            <Input placeholder="john@example.com" {...form.register("email")} />

            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>

            <Input type="password" {...form.register("password")} />

            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium underline">
            Register
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};
