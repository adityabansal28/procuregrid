import { useEffect, useState, type ReactNode } from "react";
import { Building2, Mail, MapPin, Package, Phone } from "lucide-react";
import { DashboardPanel, StatusPill } from "@/components/app/DashboardPrimitives";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type ProfileRow = {
  full_name: string | null;
  auth_identifier_type: "email" | "phone" | null;
  contact_email: string | null;
  contact_phone_e164: string | null;
};

type LegalRow = {
  gst_number: string | null;
  pan_number: string | null;
};

type AddressRow = {
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_name: string;
  postal_code: string;
  country_code: string;
};

type CatalogRow = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  image_url: string | null;
};

type CatalogMediaRow = {
  catalog_item_id: string;
  storage_bucket: string;
  storage_path: string;
};

function formatValue(value: string | null | undefined) {
  return value && value.trim() ? value : "-";
}

function formatAddress(address: AddressRow | null) {
  if (!address) return "-";

  return [
    address.address_line1,
    address.address_line2,
    `${address.city}, ${address.state_name} ${address.postal_code}`,
    address.country_code,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatRole(role: string | null | undefined) {
  if (!role) return "-";
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SupplierMyInfoSection() {
  const { user, company, membership } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [legal, setLegal] = useState<LegalRow | null>(null);
  const [address, setAddress] = useState<AddressRow | null>(null);
  const [catalogItems, setCatalogItems] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (!user || !company) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      const [profileResult, legalResult, addressResult, catalogResult, mediaResult] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, auth_identifier_type, contact_email, contact_phone_e164")
            .eq("id", user.id)
            .maybeSingle(),
          supabase
            .from("company_private_legal")
            .select("gst_number, pan_number")
            .eq("company_id", company.id)
            .maybeSingle(),
          supabase
            .from("company_addresses")
            .select("address_line1, address_line2, city, state_name, postal_code, country_code")
            .eq("company_id", company.id)
            .eq("is_primary", true)
            .maybeSingle(),
          supabase
            .from("catalog_items")
            .select("id, name, description, is_active")
            .eq("company_id", company.id)
            .order("display_order", { ascending: true }),
          supabase
            .from("catalog_item_media")
            .select("catalog_item_id, storage_bucket, storage_path")
            .order("sort_order", { ascending: true }),
        ]);

      if (cancelled) return;

      const rawCatalogItems = (catalogResult.data as Omit<CatalogRow, "image_url">[] | null) ?? [];
      const mediaRows = (mediaResult.data as CatalogMediaRow[] | null) ?? [];
      const primaryMediaByItem = new Map<string, CatalogMediaRow>();

      for (const mediaRow of mediaRows) {
        if (!primaryMediaByItem.has(mediaRow.catalog_item_id)) {
          primaryMediaByItem.set(mediaRow.catalog_item_id, mediaRow);
        }
      }

      const catalogItemsWithImages = await Promise.all(
        rawCatalogItems.map(async (item) => {
          const media = primaryMediaByItem.get(item.id);

          if (!media) {
            return {
              ...item,
              image_url: null,
            };
          }

          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from(media.storage_bucket)
            .createSignedUrl(media.storage_path, 3600);

          return {
            ...item,
            image_url: signedUrlError ? null : (signedUrlData?.signedUrl ?? null),
          };
        }),
      );

      setProfile((profileResult.data as ProfileRow | null) ?? null);
      setLegal((legalResult.data as LegalRow | null) ?? null);
      setAddress((addressResult.data as AddressRow | null) ?? null);
      setCatalogItems(catalogItemsWithImages);
      setLoading(false);
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [company, user]);

  const displayEmail =
    profile?.auth_identifier_type === "phone" ||
    user?.email?.endsWith("@phone-auth.procuregrid.local")
      ? "-"
      : formatValue(profile?.contact_email ?? user?.email);
  const displayPhone = formatValue(
    profile?.contact_phone_e164 ??
      user?.phone ??
      (user?.user_metadata.phone as string | undefined) ??
      null,
  );
  const activeCatalogItems = catalogItems.filter((item) => item.is_active);

  if (loading) {
    return (
      <Card className="border-[#dfe6ef] bg-white p-6 text-sm text-[#6d7f93]">
        Loading supplier information...
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#13263d]">My Info</h1>
        <p className="mt-2 text-sm text-[#718197]">
          This tab shows the company, legal, address, and product details saved during signup.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardPanel title="Company Profile">
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <InfoCard label="Company name" value={company?.name ?? "-"} />
            <InfoCard label="Company type" value={formatValue(company?.company_type)} />
            <InfoCard label="Business type" value={formatValue(company?.business_type)} />
            <InfoCard label="Industry category" value={formatValue(company?.industry_category)} />
            <InfoCard label="Onboarding status" value={formatValue(company?.onboarding_status)} />
            <InfoCard label="Portal role" value={formatRole(membership?.role)} />
          </div>
        </DashboardPanel>

        <DashboardPanel title="Portal Account">
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#f7fafc] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b3158] text-sm font-bold text-white">
                {(profile?.full_name || user?.email || user?.phone || "PG")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#173149]">
                  {profile?.full_name || user?.email || user?.phone || "ProcureGrid User"}
                </p>
                <p className="text-xs text-[#77879a]">
                  Primary account used for this company workspace
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <InfoLine icon={<Mail className="h-4 w-4 text-[#1d5b91]" />} value={displayEmail} />
              <InfoLine icon={<Phone className="h-4 w-4 text-[#1d5b91]" />} value={displayPhone} />
              <InfoLine
                icon={<Building2 className="h-4 w-4 text-[#1d5b91]" />}
                value={formatRole(membership?.role)}
              />
            </div>
          </div>
        </DashboardPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardPanel title="Legal Identity">
          <div className="grid gap-4 p-5 md:grid-cols-2">
            <InfoCard label="GSTIN" value={formatValue(legal?.gst_number)} />
            <InfoCard label="PAN" value={formatValue(legal?.pan_number)} />
          </div>
        </DashboardPanel>

        <DashboardPanel title="Primary Address">
          <div className="p-5">
            <div className="flex items-start gap-3 rounded-xl border border-[#e4ebf2] bg-[#fbfcfd] p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1d5b91]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8b9c]">
                  Registered Address
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-[#18324a]">
                  {formatAddress(address)}
                </p>
              </div>
            </div>
          </div>
        </DashboardPanel>
      </div>

      <DashboardPanel title="Products Added During Signup">
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {activeCatalogItems.length > 0 ? (
            activeCatalogItems.map((item) => (
              <Card key={item.id} className="border-[#dfe6ef] bg-white p-4">
                {item.image_url ? (
                  <div className="mb-4 overflow-hidden rounded-lg border border-[#e4ebf2] bg-[#f7fafc]">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#18324a]">{item.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6d7f93]">
                      {item.description || "No description added yet."}
                    </p>
                  </div>
                  <StatusPill tone="green">Active</StatusPill>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-[#dfe6ef] bg-[#fbfcfd] p-6 text-sm text-[#6d7f93] md:col-span-2 xl:col-span-3">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-[#8ea0b4]" />
                No catalog items have been saved for this supplier yet.
              </div>
            </Card>
          )}
        </div>
      </DashboardPanel>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-[#dfe6ef] bg-[#fbfcfd] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8b9c]">{label}</p>
      <p className="mt-3 text-lg font-semibold text-[#173149]">{value}</p>
    </Card>
  );
}

function InfoLine({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#36506a]">
      {icon}
      <span>{value}</span>
    </div>
  );
}
