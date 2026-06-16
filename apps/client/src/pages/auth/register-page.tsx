import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { toast } from "sonner";

import { signup } from "@/services/auth/auth.service";

import { registerSchema, type RegisterFormValues } from "./auth.schema";

import { AuthLayout } from "@/app/layouts/auth-layout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,

    onSuccess: () => {
      toast.success("Account created successfully. Please verify your email.");

      navigate("/check-email");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ?? "Failed to create account",
        );

        return;
      }

      toast.error("Failed to create account");
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    signupMutation.mutate(values);
  };

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>

          <p className="text-muted-foreground">
            Start collaborating with your team.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>

            <Input placeholder="johndoe" {...form.register("username")} />

            {form.formState.errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

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

            <Input
              type="password"
              placeholder="********"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium underline">
            Login
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};
