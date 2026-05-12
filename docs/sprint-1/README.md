# Sprint 1 Analysis

Sprint 1 is the first implementation sprint after planning. The original engineering plan defines it as:

- User signup and login
- Company creation
- Role assignment

In the current repository, that means moving from a marketing-only site to the first authenticated product surface.

## Current Repo Readiness

What already exists:

- A working React and TanStack Router frontend shell
- Global styling and component primitives
- A marketing homepage aligned to the product narrative
- Sprint 0 planning artifacts

What does not exist yet:

- Authentication flow
- User model or session state
- Company or tenant state
- Role-based routing
- Product dashboard routes
- Backend API surface
- Persistence layer or migrations

## Sprint 1 Goal

Establish the minimum platform foundation required for all later workflow modules.

By the end of Sprint 1, a user should be able to:

1. Sign up or sign in
2. Create a company
3. Join that company as its first admin
4. Land in the correct app area based on company type and role
5. Be blocked from routes they should not access

## Why Sprint 1 Matters

Every later module depends on tenant identity and role enforcement.

If auth and company boundaries are weak, then:

- RFQ visibility will leak across businesses
- Supplier and buyer data can mix incorrectly
- Approval logic becomes unreliable
- Auditability becomes harder to trust

Sprint 1 is therefore infrastructure, not just onboarding UI.

## Recommended Scope

### In scope

- Email and password signup
- Email and password login
- Session persistence
- Logout
- Company creation
- Company type selection: buyer, supplier, hybrid
- Initial membership creation for the first user
- Role assignment for that first user
- Auth-aware route guards
- Protected app shell
- Placeholder post-login dashboard by role or company type

### Out of scope

- Team invitations
- Multi-company switching for one user
- Password reset flows
- SSO
- Supplier verification workflow
- Document upload
- Admin review tooling
- Fine-grained approval workflows

## Sprint 1 User Stories

### Authentication

- As a new user, I can create an account with my name, email, and password.
- As a returning user, I can sign in securely.
- As an authenticated user, I stay logged in across refreshes.
- As a logged-in user, I can sign out.

### Company setup

- As a new user, I can create my company after signup.
- As a buyer, I can create a buyer company and enter basic business details.
- As a supplier, I can create a supplier company and enter basic business details.
- As the first member of a company, I become its `company_admin`.

### Access control

- As an unauthenticated user, I cannot access app routes.
- As an authenticated user without a company, I am redirected to company setup.
- As a buyer-side user, I should not land in supplier-only screens.
- As a supplier-side user, I should not land in buyer-only screens.

## Minimum Data Needed In Sprint 1

From the Sprint 0 data model, Sprint 1 should implement only:

- `users`
- `companies`
- `company_memberships`

Suggested first-pass fields:

### users

- `id`
- `email`
- `full_name`
- `password_hash`
- `created_at`
- `updated_at`

### companies

- `id`
- `name`
- `company_type`
- `gst_number`
- `pan_number`
- `industry_category`
- `created_at`
- `updated_at`

### company_memberships

- `id`
- `company_id`
- `user_id`
- `role`
- `status`
- `created_at`

## Recommended Role Baseline

Use the smallest role set that still supports later growth.

For Sprint 1:

- `company_admin`
- `buyer_procurement`
- `supplier_admin`

Roles defined in Sprint 0 but safe to defer in implementation until needed:

- `buyer_finance`
- `supplier_sales`
- `platform_admin`

This keeps early logic simpler while avoiding a redesign later.

## Route Architecture Recommendation

The current router only exposes `/`.

Sprint 1 should introduce route groups like:

```text
/
/login
/signup
/onboarding/company
/app
/app/buyer
/app/supplier
```

Recommended structure:

- Public routes for marketing and auth
- Protected app shell for authenticated users
- Guard that checks session
- Guard that checks company membership
- Guard that checks company type or role

## Backend Slice Recommendation

Use a modular monolith, not multiple services yet.

Sprint 1 backend modules:

- Auth module
- Users module
- Companies module
- Memberships module

Required operations:

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /companies`
- `GET /me`

`GET /me` should return enough state for frontend bootstrapping:

- current user
- active company membership
- company type
- effective role
- onboarding completeness

## Frontend Deliverables

### 1. Public auth screens

- Signup page
- Login page

### 2. Onboarding flow

- Company creation form
- Company type selector
- Basic company profile fields

### 3. Protected app shell

- Sidebar or header shell
- Placeholder dashboard landing
- Sign out entry point

### 4. Client auth state

- Session bootstrap on app load
- Loading state
- Unauthorized redirect handling

## Validation Rules

Sprint 1 should validate:

- Unique email per user
- Valid email format
- Password minimum strength
- Company name required
- Company type required
- Membership must reference an existing user and company
- Only authenticated users can create companies

## Security Requirements

Sprint 1 should explicitly enforce:

- Password hashing
- Secure session handling
- Server-side auth checks
- Server-side route and action authorization
- Tenant-aware data fetches

Do not rely on frontend hiding alone for access control.

## Critical Risks

### 1. Auth without tenant context

If a session is created without a clear company context, later modules will need a rewrite.

Mitigation:

- Make membership resolution part of session bootstrap

### 2. Over-designing RBAC too early

Too many roles in Sprint 1 will slow delivery and complicate testing.

Mitigation:

- Implement a minimal baseline role matrix

### 3. Mixing buyer and supplier concerns too early

Hybrid company support can create UI branching complexity.

Mitigation:

- Store `hybrid` in the model if needed, but optimize the first UI for buyer and supplier paths

### 4. No backend contract for app bootstrap

Without a single `me/session` shape, the frontend will accumulate ad hoc state logic.

Mitigation:

- Define one canonical bootstrap response early

## Acceptance Criteria

Sprint 1 is done when:

- A new user can sign up successfully
- A returning user can log in successfully
- Session persists across refresh
- An authenticated user without a company is redirected to company onboarding
- A new company can be created and linked to the signed-in user
- The creating user becomes `company_admin`
- Protected routes reject unauthenticated access
- Buyer and supplier users land in the correct app area
- The app can render a basic authenticated shell using real session data

## Suggested Build Order

1. Define shared auth, company, and membership types
2. Implement persistence schema and migrations
3. Build signup, login, logout, and session endpoints
4. Add frontend auth pages and session bootstrap
5. Add company creation flow
6. Add protected route guards
7. Add placeholder buyer and supplier app shells
8. Add basic happy-path tests

## Testing Plan

### Unit tests

- Password validation
- Password hashing helper
- Role guard logic
- Company creation service validation

### Integration tests

- Signup creates user only
- Company creation links membership correctly
- Login returns session
- Unauthorized requests are blocked

### End-to-end tests

- New user signup to company creation
- Returning user login to app shell
- Unauthenticated redirect to login

## Recommended Sprint 1 Output

The strongest Sprint 1 outcome is not a polished dashboard. It is a trustworthy identity and tenancy foundation that makes Sprint 2 and Sprint 3 safe to build.

If tradeoffs appear, prioritize:

1. Correct session handling
2. Correct tenant boundaries
3. Correct membership and role assignment
4. Simple but working UI

Pretty onboarding screens are optional. Clean access control is not.
