# Low-Fidelity Wireframes

These wireframes are intentionally simple and optimized for implementation planning. They define screen structure, core actions, and information hierarchy for the MVP.

## Information Architecture

- Marketing site
- Auth
- Buyer app
- Supplier app
- Admin app

## Marketing Site

```
+--------------------------------------------------------------------------------+
| Navbar: Logo | Platform | Workflow | Trust Layer | Pricing | Sign In | Demo    |
+--------------------------------------------------------------------------------+
| Hero                                                                        |
| "Protected procurement for manufacturers"                                   |
| [Start sourcing] [List as supplier]                                         |
| Trust signals: verified suppliers | escrow-backed transactions | audit trail |
+--------------------------------------------------------------------------------+
| Problem section                                                              |
| Manual RFQs | WhatsApp negotiations | low trust | delayed payments           |
+--------------------------------------------------------------------------------+
| Platform modules                                                             |
| Verification | Workflow | Escrow | Trust Score | Analytics | Credit Layer    |
+--------------------------------------------------------------------------------+
| Workflow                                                                     |
| PR -> RFQ -> Quote -> PO -> GRN -> Invoice -> Payment                       |
+--------------------------------------------------------------------------------+
| Trust layer                                                                  |
| Why the data moat matters                                                    |
+--------------------------------------------------------------------------------+
| CTA                                                                          |
| Book demo / Talk to sales                                                    |
+--------------------------------------------------------------------------------+
```

## Auth And Company Setup

```
+----------------------------------------------------+
| ProcureGrid                                        |
+----------------------------------------------------+
| Sign up / Sign in                                  |
| Email                                               |
| Password                                            |
| [Continue]                                          |
+----------------------------------------------------+
| After signup:                                       |
| Company name                                        |
| Company type: Buyer / Supplier                      |
| GST / PAN basics                                    |
| [Create company]                                    |
+----------------------------------------------------+
```

## Buyer Dashboard

```
+--------------------------------------------------------------------------------+
| Sidebar: Dashboard | RFQs | Quotes | POs | GRNs | Payments | Suppliers        |
+--------------------------------------------------------------------------------+
| Header: Company switcher | Notifications | Profile                           |
+--------------------------------------------------------------------------------+
| KPI row: Active RFQs | Open POs | Pending GRNs | Payment exceptions           |
+--------------------------------------------------------------------------------+
| Primary panel: Recent RFQs                                                   |
| RFQ ID | Category | Suppliers invited | Status | Last update | Action         |
+--------------------------------------------------------------------------------+
| Secondary panel: Supplier watchlist                                          |
| Name | Trust score | Verification tier | On-time delivery | Open disputes     |
+--------------------------------------------------------------------------------+
```

## Supplier Dashboard

```
+--------------------------------------------------------------------------------+
| Sidebar: Dashboard | Profile | Verification | RFQs | Quotes | Orders | Payments|
+--------------------------------------------------------------------------------+
| KPI row: Active RFQs | Quote win rate | Pending payments | Trust score         |
+--------------------------------------------------------------------------------+
| Verification card                                                             |
| Status: Pending / Verified / Trusted                                         |
| Missing documents                                                             |
| [Upload documents]                                                            |
+--------------------------------------------------------------------------------+
| Incoming RFQs                                                                 |
| RFQ ID | Buyer | Category | Due date | Status | [Submit quote]               |
+--------------------------------------------------------------------------------+
```

## Admin Dashboard

```
+--------------------------------------------------------------------------------+
| Sidebar: Dashboard | Supplier Reviews | Audit Log | Exceptions | Users         |
+--------------------------------------------------------------------------------+
| KPI row: Pending verifications | Payment disputes | Open exceptions            |
+--------------------------------------------------------------------------------+
| Verification queue                                                            |
| Supplier | Documents | Submitted on | Risk flags | [Review]                   |
+--------------------------------------------------------------------------------+
| Audit activity feed                                                           |
| Time | Actor | Tenant | Entity | Action | Transition                         |
+--------------------------------------------------------------------------------+
```

## RFQ Creation Flow

```
Step 1: Purchase request details
- Item or category
- Quantity
- Required by date
- Specs or attachments

Step 2: Supplier selection
- Search verified suppliers
- Select invited suppliers

Step 3: Commercial parameters
- Quote due date
- Delivery terms
- Payment terms

Step 4: Review and send
- Summary
- [Save draft] [Send RFQ]
```

## Quote Comparison Screen

```
+--------------------------------------------------------------------------------+
| RFQ summary                                                                   |
+--------------------------------------------------------------------------------+
| Supplier A | Supplier B | Supplier C                                          |
| Price      | Price      | Price                                                |
| Lead time  | Lead time  | Lead time                                            |
| MOQ        | MOQ        | MOQ                                                  |
| Trust      | Trust      | Trust                                                |
| Terms      | Terms      | Terms                                                |
| [Shortlist]| [Shortlist]| [Shortlist]                                          |
+--------------------------------------------------------------------------------+
| [Generate PO from selected quote]                                             |
+--------------------------------------------------------------------------------+
```

## Delivery And Payment Tracking

```
+--------------------------------------------------------------------------------+
| PO status timeline                                                            |
| Created -> Accepted -> Dispatched -> Delivered -> GRN -> Invoice -> Payment   |
+--------------------------------------------------------------------------------+
| Payment card                                                                  |
| Total amount                                                                  |
| Escrow state                                                                  |
| Release milestone                                                             |
| Exceptions or disputes                                                        |
+--------------------------------------------------------------------------------+
```
