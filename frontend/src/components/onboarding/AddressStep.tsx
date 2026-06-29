import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  countriesData,
  findStateCode,
  getCountryByCode,
  shouldLookupPincode,
  type AddressFormData,
} from "@/lib/onboarding-data";

type LookupStatus = "idle" | "loading" | "success" | "error";

type Props = {
  data: AddressFormData;
  onChange: (data: AddressFormData) => void;
  actionType: "next" | "submit";
  submitting?: boolean;
  error?: string | null;
  onBack: () => void;
  onNext: () => void;
};

// ─── API helpers ────────────────────────────────────────────────────────────

async function lookupIndia(pin: string) {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
  if (!res.ok) throw new Error("API error");
  const json = (await res.json()) as Array<{
    Status: string;
    PostOffice?: Array<{ District: string; Block: string; State: string }>;
  }>;
  if (json[0]?.Status !== "Success" || !json[0].PostOffice?.length) {
    throw new Error("not_found");
  }
  const po = json[0].PostOffice[0];
  return { city: po.District || po.Block, stateName: po.State };
}

async function lookupZippopotam(countryCode: string, postalCode: string) {
  const clean = postalCode.trim().replace(/\s/g, "");
  const res = await fetch(
    `https://api.zippopotam.us/${countryCode.toLowerCase()}/${clean}`,
  );
  if (!res.ok) throw new Error("not_found");
  const json = (await res.json()) as {
    places?: Array<{ "place name": string; state: string; "state abbreviation": string }>;
  };
  if (!json.places?.length) throw new Error("not_found");
  const place = json.places[0];
  return { city: place["place name"], stateName: place["state"] };
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AddressStep({
  data,
  onChange,
  actionType,
  submitting,
  error,
  onBack,
  onNext,
}: Props) {
  const selectedCountry = getCountryByCode(data.country);
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function set<K extends keyof AddressFormData>(key: K, value: AddressFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  // Reset state + clear lookup when country changes
  useEffect(() => {
    onChange({ ...data, state: "", city: "" });
    setLookupStatus("idle");
    setLookupError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.country]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  async function doLookup(pincode: string, countryCode: string) {
    setLookupStatus("loading");
    setLookupError(null);
    try {
      const { city, stateName } =
        countryCode === "IN"
          ? await lookupIndia(pincode.trim())
          : await lookupZippopotam(countryCode, pincode);

      const stateCode = findStateCode(countryCode, stateName) ?? "";
      onChange({ ...data, pincode, city, state: stateCode });
      setLookupStatus("success");

      // Reset success badge after 3 s
      setTimeout(() => setLookupStatus("idle"), 3000);
    } catch (e) {
      const msg = e instanceof Error && e.message === "not_found"
        ? "No location found for this code. Please fill in manually."
        : "Location lookup failed. Please fill in manually.";
      setLookupError(msg);
      setLookupStatus("error");
    }
  }

  function handlePincodeChange(value: string) {
    set("pincode", value);
    setLookupStatus("idle");
    setLookupError(null);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (shouldLookupPincode(value, data.country)) {
      timerRef.current = setTimeout(() => void doLookup(value, data.country), 600);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const canProceed =
    data.addressLine1.trim().length > 0 &&
    data.city.trim().length > 0 &&
    data.country.length > 0 &&
    data.state.length > 0 &&
    data.pincode.trim().length > 0 &&
    !submitting;

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
      {/* Address Line 1 */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="addressLine1">
          Address Line 1 <span className="text-destructive">*</span>
        </label>
        <Input
          id="addressLine1"
          type="text"
          placeholder="Building, street, locality"
          value={data.addressLine1}
          onChange={(e) => set("addressLine1", e.target.value)}
          required
        />
      </div>

      {/* Address Line 2 */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="addressLine2">
          Address Line 2{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="addressLine2"
          type="text"
          placeholder="Apartment, floor, landmark"
          value={data.addressLine2}
          onChange={(e) => set("addressLine2", e.target.value)}
        />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Country <span className="text-destructive">*</span>
        </label>
        <Select value={data.country} onValueChange={(v) => set("country", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countriesData.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PIN / ZIP with auto-fill indicator */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="pincode">
          {selectedCountry?.postalLabel ?? "Postal Code"}{" "}
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            id="pincode"
            type="text"
            placeholder={selectedCountry?.code === "IN" ? "6-digit PIN" : "Postal code"}
            value={data.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            className={lookupStatus === "success" ? "border-green-500 pr-9" : "pr-9"}
            required
          />
          {lookupStatus === "loading" && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
          {lookupStatus === "success" && (
            <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
          )}
        </div>
        {lookupStatus === "loading" && (
          <p className="text-xs text-muted-foreground">Fetching location…</p>
        )}
        {lookupStatus === "success" && (
          <p className="text-xs text-green-600">✓ City and state auto-filled</p>
        )}
        {lookupStatus === "error" && lookupError && (
          <p className="text-xs text-amber-600">{lookupError}</p>
        )}
        {data.country === "AE" && data.pincode.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Auto-fill not available for UAE — please enter city and state manually.
          </p>
        )}
      </div>

      {/* State */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          State / Region <span className="text-destructive">*</span>
        </label>
        <Select
          value={data.state}
          onValueChange={(v) => set("state", v)}
          disabled={!selectedCountry}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                selectedCountry ? "Select state / region" : "Select country first"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {(selectedCountry?.states ?? []).map((s) => (
              <SelectItem key={s.code} value={s.code}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City — editable even when auto-filled */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="city">
          City <span className="text-destructive">*</span>
        </label>
        <Input
          id="city"
          type="text"
          placeholder="City name"
          value={data.city}
          onChange={(e) => set("city", e.target.value)}
          required
        />
      </div>

      {/* Submission error */}
      {error ? (
        <p className="text-sm text-destructive md:col-span-2">{error}</p>
      ) : null}

      {/* Actions */}
      <div className="flex items-center justify-between md:col-span-2 pt-2">
        <Button variant="outline" type="button" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit" disabled={!canProceed}>
          {submitting && actionType === "submit" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating…
            </span>
          ) : actionType === "next" ? (
            "Next — Product Catalog →"
          ) : (
            "Submit & Enter Workspace →"
          )}
        </Button>
      </div>
    </form>
  );
}
