import { redirect } from "next/navigation";

// The website no longer uses a custom sign-in page.
// Customers manage their accounts via the Zoho Customer Portal.
export default function SignInPage() {
  redirect("https://billing.zohosecure.com/portal/culturewirelessportal/signin");
}
