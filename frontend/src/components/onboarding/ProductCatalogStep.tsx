import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, X, Plus, Package } from "lucide-react";
import type { ProductFormData, ProductItem } from "@/lib/onboarding-data";
import { getProductSuggestions, type ProductSuggestion } from "@/lib/products";

type Props = {
  data: ProductFormData;
  onChange: (data: ProductFormData) => void;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ProductCatalogStep({
  data,
  onChange,
  submitting,
  error,
  onBack,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // ── Autocomplete state ──────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  const handleProductNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      set("productName", val);
      const matches = getProductSuggestions(val);
      setSuggestions(matches);
      setActiveIndex(-1);
      setShowSuggestions(matches.length > 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, onChange]
  );

  function handleSuggestionSelect(name: string) {
    set("productName", name);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onChange({ ...data, imageFile: file, imagePreview: preview });
  }

  function clearImage() {
    if (data.imagePreview) URL.revokeObjectURL(data.imagePreview);
    onChange({ ...data, imageFile: null, imagePreview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  /** Append current product to the list and reset the form */
  function handleAddMore() {
    if (!currentProductValid) return;
    const newItem: ProductItem = {
      productName: data.productName.trim(),
      description: data.description,
      imageFile: data.imageFile,
      imagePreview: data.imagePreview,
    };
    onChange({
      ...data,
      products: [...data.products, newItem],
      productName: "",
      description: "",
      imageFile: null,
      imagePreview: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeProduct(index: number) {
    const updated = data.products.filter((_, i) => i !== index);
    onChange({ ...data, products: updated });
  }

  // Image is required; product name is required
  const currentProductValid =
    data.productName.trim().length > 0 && data.imageFile !== null;

  // Can submit if: at least one product is in the list OR current form is valid
  const hasAtLeastOne = data.products.length > 0 || currentProductValid;
  const canSubmit = hasAtLeastOne && !submitting;

  return (
    <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="md:col-span-2">
        <p className="text-sm text-muted-foreground">
          Add your products or services so buyers can discover you. You can add more from your workspace later.
        </p>
      </div>

      {/* Added Products List */}
      {data.products.length > 0 && (
        <div className="md:col-span-2 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Added Products ({data.products.length})
          </p>
          <div className="space-y-2">
            {data.products.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                {p.imagePreview ? (
                  <img
                    src={p.imagePreview}
                    alt={p.productName}
                    className="h-12 w-12 shrink-0 rounded-md object-cover border border-border"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                    <Package className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.productName}</p>
                  {p.description && (
                    <p className="truncate text-xs text-muted-foreground">{p.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(i)}
                  aria-label="Remove product"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 pt-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground">Add another product</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      {/* Product Name — with autocomplete */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="productName">
          Product / Service Name <span className="text-destructive">*</span>
        </label>

        {/* Autocomplete wrapper */}
        <div ref={inputWrapperRef} className="relative">
          <Input
            id="productName"
            type="text"
            autoComplete="off"
            placeholder="e.g. CNC Machined Aluminium Brackets"
            value={data.productName}
            onChange={handleProductNameChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
          />

          {/* Dropdown */}
          {showSuggestions && (
            <ul
              role="listbox"
              aria-label="Product suggestions"
              className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <li
                  key={`${s.name}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent blur before click registers
                    handleSuggestionSelect(s.name);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={[
                    "flex items-center justify-between gap-3 cursor-pointer px-3 py-2.5 text-sm transition-colors",
                    i === activeIndex
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/60 text-foreground",
                  ].join(" ")}
                >
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border whitespace-nowrap">
                    {s.category}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Image Upload — Required */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium">
          Product Image <span className="text-destructive">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {data.imagePreview ? (
          <div className="relative h-36 w-full overflow-hidden rounded-lg border border-border">
            <img
              src={data.imagePreview}
              alt="Product preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5"
          >
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs font-medium">Click to upload image</span>
            <span className="text-[10px]">PNG, JPG, WEBP up to 5 MB</span>
          </button>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium" htmlFor="description">
          Description{" "}
          <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Describe specifications, materials, certifications…"
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none"
        />
      </div>

      {/* Add More Product */}
      <div className="md:col-span-2">
        <Button
          type="button"
          variant="outline"
          disabled={!currentProductValid}
          onClick={handleAddMore}
          className="w-full border-dashed gap-2"
        >
          <Plus className="h-4 w-4" />
          Add More Product
        </Button>
        {!currentProductValid && data.productName.trim().length > 0 && !data.imageFile && (
          <p className="mt-1.5 text-xs text-muted-foreground text-center">
            Please upload a product image to add this product.
          </p>
        )}
      </div>

      {/* Error */}
      {error ? (
        <p className="text-sm text-destructive md:col-span-2">{error}</p>
      ) : null}

      {/* Actions */}
      <div className="flex items-center justify-between md:col-span-2 pt-2">
        <Button variant="outline" type="button" onClick={onBack}>
          ← Back
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
              </svg>
              Creating workspace…
            </span>
          ) : (
            "Submit & Enter Workspace →"
          )}
        </Button>
      </div>
    </form>
  );
}
