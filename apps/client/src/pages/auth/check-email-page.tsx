import { Card } from "@/components/ui/card";

export const CheckEmailPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-2 text-2xl font-bold">Check your email</h1>

        <p className="text-muted-foreground">
          We've sent a verification link to your email. Please verify your
          account before logging in.
        </p>
      </Card>
    </div>
  );
};
