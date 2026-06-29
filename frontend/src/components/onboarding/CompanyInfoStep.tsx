import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderCircle } from "lucide-react";
import {
  b2bCompanyTypes,
  validateGST,
  validatePAN,
  type CompanyFormData,
} from "@/lib/onboarding-data";

type Props = {
  data: CompanyFormData;
  onChange: (data: CompanyFormData) => void;
  onNext: () => void;
  onSignOut: () => void;
  signingOut: boolean;
};

export function CompanyInfoStep({ data, onChange, onNext, onSignOut, signingOut }: Props) {
  const [gstError, setGstError] = useState<string | null>(null);
  const [panError, setPanError] = useState<string | null>(null);

  function set<K extends keyof CompanyFormData>(key: K, value: CompanyFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  function handleGstChange(raw: string) {
    const upper = raw.toUpperCase();
    set("gstNumber", upper);
    setGstError(upper.trim() ? validateGST(upper) : "GSTIN is required");
  }

  function handlePanChange(raw: string) {
    const upper = raw.toUpperCase();
    set("panNumber", upper);
    setPanError(upper.trim() ? validatePAN(upper) : "PAN is required");
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    // Validate — treat empty as an error since both are required
    const gst = data.gstNumber.trim()
      ? validateGST(data.gstNumber)
      : "GSTIN is required";
    const pan = data.panNumber.trim()
      ? validatePAN(data.panNumber)
      : "PAN is required";
    setGstError(gst);
    setPanError(pan);
    if (gst || pan) return;
    onNext();
  }

  const canNext =
    data.name.trim().length > 0 &&
    data.businessType.length > 0 &&
    data.gstNumber.trim().length > 0 &&
    data.panNumber.trim().length > 0 &&
    !gstError &&
    !panError;

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleNext}>
      {/* Company Name */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="companyName">
          Company / Business Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="companyName"
          type="text"
          placeholder="e.g. Sharma Industries Pvt. Ltd."
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      {/* Primary Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Primary Role <span className="text-destructive">*</span>
        </label>
        <Select
          value={data.companyType}
          onValueChange={(v) => set("companyType", v as CompanyFormData["companyType"])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buyer">Buyer — I purchase goods/services</SelectItem>
            <SelectItem value="supplier">Supplier — I sell goods/services</SelectItem>
            <SelectItem value="hybrid">Both — I buy and sell</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Business Type <span className="text-destructive">*</span>
        </label>
        <Select
          value={data.businessType}
          onValueChange={(v) => set("businessType", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select business type" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {b2bCompanyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* GST */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="gstNumber">
          GSTIN <span className="text-destructive">*</span>
        </label>
        <Input
          id="gstNumber"
          type="text"
          maxLength={15}
          placeholder="22AAAAA0000A1Z5"
          value={data.gstNumber}
          onChange={(e) => handleGstChange(e.target.value)}
          aria-invalid={!!gstError}
          className={gstError ? "border-destructive focus-visible:ring-destructive/20" : ""}
        />
        {gstError && <p className="text-xs text-destructive">{gstError}</p>}
      </div>

      {/* PAN */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="panNumber">
          PAN <span className="text-destructive">*</span>
        </label>
        <Input
          id="panNumber"
          type="text"
          maxLength={10}
          placeholder="AAAAA0000A"
          value={data.panNumber}
          onChange={(e) => handlePanChange(e.target.value)}
          aria-invalid={!!panError}
          className={panError ? "border-destructive focus-visible:ring-destructive/20" : ""}
        />
        {panError && <p className="text-xs text-destructive">{panError}</p>}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between md:col-span-2 pt-2">
        <Button variant="outline" type="button" onClick={onSignOut} disabled={signingOut}>
          {signingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Sign out
        </Button>
        <Button type="submit" disabled={!canNext}>
          Next — Address Details →
        </Button>
      </div>
    </form>
  );
}
