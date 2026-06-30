/**
 * Curated product name catalogue used for autocomplete suggestions in the
 * Product Catalog onboarding step.  Organised by industry / category so it
 * is easy to extend.
 */

export type ProductSuggestion = {
  name: string;
  category: string;
};

const RAW_PRODUCTS: { category: string; names: string[] }[] = [
  {
    category: "Manufacturing & Engineering",
    names: [
      "CNC Machined Aluminium Brackets",
      "Stainless Steel Fasteners",
      "Precision Turned Components",
      "Sheet Metal Fabrication Parts",
      "Cast Iron Pump Bodies",
      "Hydraulic Cylinder Assemblies",
      "Pneumatic Valve Fittings",
      "Industrial Gear Sets",
      "Ball Bearings & Roller Bearings",
      "Welded Structural Steel Frames",
      "Forged Flanges & Fittings",
      "Custom Injection Moulded Parts",
      "Die Cast Zinc Alloy Components",
      "Carbon Steel Pipes & Tubes",
      "Aluminium Extrusion Profiles",
    ],
  },
  {
    category: "Electrical & Electronics",
    names: [
      "PCB Assembly (PCBA)",
      "Industrial Control Panels",
      "HV / LV Switchgear",
      "Three-Phase Electric Motors",
      "Variable Frequency Drives (VFD)",
      "Solar PV Panels",
      "LED Street Lights",
      "Lithium-Ion Battery Packs",
      "Transformers & Inductors",
      "Cable Harness Assemblies",
      "Sensors & Transducers",
      "SCADA & PLC Systems",
      "UPS Systems",
      "MCB / MCCB Circuit Breakers",
      "Power Distribution Units (PDU)",
    ],
  },
  {
    category: "IT & Software",
    names: [
      "Enterprise Resource Planning (ERP) Software",
      "Cloud Hosting & Managed Services",
      "Custom Web Application Development",
      "Mobile App Development (iOS & Android)",
      "Cybersecurity Audit & Consulting",
      "Data Analytics & BI Dashboard",
      "Machine Learning Model Development",
      "IT Infrastructure Setup & Support",
      "API Integration Services",
      "UI/UX Design Services",
      "DevOps & CI/CD Pipeline Setup",
      "Network Design & Installation",
      "Digital Marketing Services",
      "CRM Software Implementation",
      "SaaS Product Development",
    ],
  },
  {
    category: "Chemicals & Petrochemicals",
    names: [
      "Industrial Solvents",
      "Specialty Lubricants & Greases",
      "Epoxy Resins",
      "Polymer Pellets (HDPE / PP / PVC)",
      "Surfactants & Emulsifiers",
      "Pigments & Dyes",
      "Industrial Adhesives & Sealants",
      "Fertilisers (NPK)",
      "Agrochemicals & Pesticides",
      "Water Treatment Chemicals",
      "Rubber Compounding Materials",
      "Silicone Sealants",
      "Cleaning Agents & Degreasers",
      "Paint & Coatings",
      "Hydrogen Peroxide",
    ],
  },
  {
    category: "Textiles & Apparel",
    names: [
      "Cotton Yarn (Combed / Carded)",
      "Polyester Fabric",
      "Denim Fabric",
      "Knitted Jerseys",
      "Woollen Blankets",
      "Industrial Workwear & Uniforms",
      "High-Visibility Safety Jackets",
      "Medical Scrubs",
      "Embroidery & Printing Services",
      "Woven Labels & Hang Tags",
      "Non-Woven Fabric",
      "Spunbond PP Fabric",
      "Technical Textiles (Geotextiles)",
      "Leather Goods & Accessories",
      "Silk Fabrics",
    ],
  },
  {
    category: "Agriculture & Food Processing",
    names: [
      "Basmati Rice",
      "Wheat Flour (Atta)",
      "Refined Sugar",
      "Spices & Masala Blends",
      "Frozen Vegetables",
      "Edible Oils (Sunflower / Palm)",
      "Dairy Products (Milk Powder)",
      "Pulses & Lentils",
      "Organic Fertilisers",
      "Seeds & Planting Material",
      "Aquaculture Products (Shrimp)",
      "Tea & Coffee",
      "Cashew Kernels",
      "Processed Fruit Concentrates",
      "Packaged Drinking Water",
    ],
  },
  {
    category: "Construction & Building Materials",
    names: [
      "Portland Cement",
      "Ready-Mix Concrete",
      "TMT Steel Bars (Fe 500)",
      "AAC Blocks",
      "Ceramic & Porcelain Tiles",
      "Architectural Glass",
      "UPVC Doors & Windows",
      "Modular Kitchen Fittings",
      "Sanitary Ware",
      "Roofing Sheets (GI / Polycarbonate)",
      "Waterproofing Compounds",
      "Wooden Flooring",
      "Electrical Conduit Pipes",
      "Scaffolding Systems",
      "Stone Aggregates & Sand",
    ],
  },
  {
    category: "Packaging",
    names: [
      "Corrugated Cartons & Boxes",
      "BOPP / BOPET Films",
      "Flexible Laminate Pouches",
      "Glass Bottles & Jars",
      "PET Bottles & Containers",
      "Aluminium Foil Lids",
      "Shrink Wrap Films",
      "Industrial PP Woven Bags",
      "Blister Packaging",
      "Label Printing & Application",
      "Foam Padding & Inserts",
      "Pallets (Wooden / Plastic)",
      "Tamper-Evident Seals",
      "Thermoformed Trays",
      "Stretch Wrap Film",
    ],
  },
  {
    category: "Logistics & Warehousing",
    names: [
      "Third-Party Logistics (3PL) Services",
      "Cold Chain Logistics",
      "Freight Forwarding",
      "Customs Clearance Services",
      "Last-Mile Delivery Solutions",
      "Pallet Racking Systems",
      "Forklift Trucks",
      "Automated Conveyor Systems",
      "Warehouse Management Software (WMS)",
      "Container Rental & Leasing",
    ],
  },
  {
    category: "Healthcare & Pharma",
    names: [
      "Active Pharmaceutical Ingredients (API)",
      "Generic Tablets & Capsules",
      "Medical Devices (BP Monitor)",
      "Surgical Instruments",
      "Disposable Syringes",
      "IV Fluids & Infusion Sets",
      "Diagnostic Kits & Reagents",
      "PPE Kits",
      "Hospital Furniture",
      "Pharmaceutical Packaging (Blister / Vials)",
    ],
  },
  {
    category: "Automotive",
    names: [
      "Auto Body Stamped Parts",
      "Engine Components & Gaskets",
      "Brake Pads & Rotors",
      "Automotive Wiring Harness",
      "Radiators & Cooling Systems",
      "Suspension Components",
      "Tyre & Wheel Assemblies",
      "Fuel Injection Systems",
      "Automotive Paints & Coatings",
      "EV Battery Management Systems",
    ],
  },
  {
    category: "Energy & Environment",
    names: [
      "Solar Mounting Structures",
      "Wind Turbine Blades",
      "Biogas Plants & Equipment",
      "ETP / STP Systems",
      "Energy Auditing Services",
      "Industrial Water Purifiers (RO)",
      "Air Pollution Control Equipment",
      "Smart Energy Meters",
      "Power Cables & Conductors",
      "Generator Sets (DG Sets)",
    ],
  },
];

/** Flat list of all product suggestions derived from the catalogue above. */
export const ALL_PRODUCT_SUGGESTIONS: ProductSuggestion[] = RAW_PRODUCTS.flatMap(
  ({ category, names }) => names.map((name) => ({ name, category })),
);

/**
 * Returns up to `limit` suggestions that match the query (case-insensitive).
 * Matching priority:
 *   1. Names that *start with* the query string.
 *   2. Names that *contain* the query string elsewhere.
 */
export function getProductSuggestions(query: string, limit = 8): ProductSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const startsWith: ProductSuggestion[] = [];
  const contains: ProductSuggestion[] = [];

  for (const suggestion of ALL_PRODUCT_SUGGESTIONS) {
    const lc = suggestion.name.toLowerCase();
    if (lc.startsWith(q)) {
      startsWith.push(suggestion);
    } else if (lc.includes(q)) {
      contains.push(suggestion);
    }
    if (startsWith.length + contains.length >= limit * 2) break; // early exit
  }

  return [...startsWith, ...contains].slice(0, limit);
}
