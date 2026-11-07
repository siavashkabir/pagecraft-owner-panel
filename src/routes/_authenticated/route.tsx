import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth", search: { redirect: location.href || "/dashboard" } });
    }
    return { user: data.user };
  },
  component: AuthenticatedLayout,
  pendingComponent: AuthenticatedPending,
});

function AuthenticatedLayout() {
  return <Outlet />;
}

function AuthenticatedPending() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16" aria-label="در حال بررسی ورود">
      <Skeleton className="h-10 w-56 mb-8" />
      <Skeleton className="h-32 w-full mb-5" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
