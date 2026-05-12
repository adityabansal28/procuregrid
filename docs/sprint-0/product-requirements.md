# Product Requirements Document

## Overview

ProcureGrid is a web-first procurement platform for Indian manufacturers and industrial SMEs. The MVP combines:

- Verified supplier onboarding
- Full procurement workflow tracking
- Protected transaction states
- Trust and audit infrastructure
- Role-based dashboards

The product should replace fragmented procurement activity currently spread across spreadsheets, email, WhatsApp, and manual follow-up.

## Problem Statement

Industrial procurement teams currently face:

- Low supplier trust and poor verification
- Manual RFQ creation and distribution
- No clean quote comparison workflow
- Weak PO, shipment, and GRN traceability
- Delayed payments and recurring disputes
- No structured audit trail
- Little visibility into supplier quality, delivery, or buyer payment behavior

## Product Vision

Build a procurement operating system with a trust layer for industrial businesses. The MVP should be reliable, understandable, and narrow enough to implement correctly before expanding.

## Primary Users

### Buyer-side users

- Procurement executive
- Procurement manager
- Finance approver
- Company admin

### Supplier-side users

- Supplier owner or admin
- Sales or account manager
- Operations contact

### Platform users

- Verification admin
- Operations admin

## MVP Goals

- Let buyers create and manage procurement workflows in one system
- Let suppliers join the network with verifiable credentials
- Protect early transactions with tracked escrow states
- Preserve an audit trail across all critical actions
- Support buyer, supplier, and admin visibility without cross-tenant data leakage

## Non-Goals For MVP

- Full ERP coverage
- Native lending or underwriting
- Complex AI automation
- Broad marketplace discovery features beyond procurement flow needs
- Deep integrations with external ERPs in the first release

## Core User Journeys

### Buyer journey

1. Sign up and create company
2. Invite teammates and assign roles
3. Create purchase request and RFQ
4. Invite suppliers and collect quotations
5. Compare quotes and generate PO
6. Track shipment, GRN, invoice, and payment status
7. Review supplier performance and procurement analytics

### Supplier journey

1. Sign up and create supplier profile
2. Upload GST, PAN, certifications, and company information
3. Submit verification artifacts
4. Receive RFQs and submit quotations
5. Accept PO, track delivery, and monitor payment status
6. Build trust score and repeat business history

### Admin journey

1. Review supplier documents
2. Approve or reject verification
3. Audit transactions and workflow events
4. Monitor exceptions, disputes, and suspicious activity

## Functional Requirements

### 1. Authentication and company setup

- Email-based signup and login
- Company creation
- Role assignment
- Tenant-aware access boundaries

### 2. Supplier onboarding and verification

- Supplier profile creation
- Document upload for GST, PAN, certifications, and proofs
- Verification workflow with admin actions
- Supplier status levels: pending, verified, trusted, strategic

### 3. RFQ workflow

- Create purchase request and RFQ
- Invite one or more suppliers
- Track RFQ status
- Collect and store quotations

### 4. Quote comparison and purchase order

- Compare submitted quotations side by side
- Capture commercial and delivery terms
- Convert approved quote into a PO
- Track PO state transitions

### 5. Shipment, GRN, invoice, and payment tracking

- Capture delivery milestones
- Record GRN
- Upload or record invoice
- Track payment and escrow-related status

### 6. Dashboards

- Buyer dashboard
- Supplier dashboard
- Admin dashboard

### 7. Audit logging

- Log critical workflow and approval actions
- Persist actor, tenant, entity, timestamp, and transition details

## Key States

These states should be modeled explicitly and validated in business logic.

- Supplier verification: draft, submitted, under_review, verified, rejected
- RFQ: draft, sent, closed, awarded, cancelled
- Quotation: submitted, shortlisted, rejected, converted
- PO: created, accepted, in_fulfillment, delivered, closed, cancelled
- Shipment: pending, dispatched, delivered
- GRN: pending, recorded, accepted, disputed
- Payment: pending, escrow_secured, partially_released, released, disputed

## Success Criteria

- Buyers can complete an RFQ to PO to payment workflow without leaving the platform
- Suppliers can onboard and participate with verified profile data
- No user can access data from another company
- Every major state transition is auditable
- The team can demo the workflow end to end with seed data

## Sprint Sequence

- Sprint 0: planning and design
- Sprint 1: auth and company
- Sprint 2: supplier module
- Sprint 3: RFQ module
- Sprint 4: quotation plus PO
- Sprint 5: escrow plus GRN
- Sprint 6: dashboards
- Sprint 7: QA and deployment

## Open Decisions

- Which first vertical to target in go-to-market messaging
- Whether negotiation should be fully in-app in the MVP or deferred
- What minimum verification evidence is required for a verified badge
- Which payment partner constraints should shape the escrow state machine
