import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export async function upsertProfileForUser(
  user: User,
  {
    fullName,
    authIdentifierType,
    contactEmail,
    contactPhoneE164,
  }: {
    fullName: string | null;
    authIdentifierType: "email" | "phone";
    contactEmail: string | null;
    contactPhoneE164: string | null;
  },
) {
  const supabase = getSupabaseBrowserClient();

  return supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    auth_identifier_type: authIdentifierType,
    contact_email: contactEmail,
    contact_phone_e164: contactPhoneE164,
  });
}
