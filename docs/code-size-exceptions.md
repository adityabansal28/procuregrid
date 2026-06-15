# Code Size Exceptions

`src/components/ui/sidebar.tsx` is an upstream-style shadcn UI primitive kept as one module so its
component family, context, variants, and update path remain compatible. Splitting this generated
primitive would increase coupling and make upstream maintenance harder without improving product
ownership. Product-specific source files must remain below the 400-line limit in `AGENTS.md`.
