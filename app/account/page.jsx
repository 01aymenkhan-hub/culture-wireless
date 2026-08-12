import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccountDashboard from "./AccountDashboard";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { isAuthenticated, userId } = await auth();

  // This server-side check protects the account page even if client-side UI
  // components are manipulated or JavaScript is disabled.
  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=%2Faccount");
  }

  return <AccountDashboard />;
}
