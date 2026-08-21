import { redirect } from "next/navigation";

// The website no longer uses a custom sign-up page.
// Customers create their account automatically during the Zoho Hosted Checkout flow.
export default function SignUpPage() {
  redirect("https://billing.zohosecure.com/portal/culturewirelessportal/signin");
}
