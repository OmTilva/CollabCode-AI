import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">CollabCode</h2>
        </div>

        <div className="flex-1">Sidebar</div>

        <LogoutButton />
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};
