# Elevated Stay (`stay.com.ng`)
### Turnkey Residential Management & Asset Lifecycle Protection
*An Elevation Studio Initiative*

Elevated Stay is an architectural-grade PropTech platform engineered for high-value family compounds and institutional diaspora investors in Old Ikoyi, Banana Island, Victoria Island, Lekki Phase 1 (Lagos), and Maitama / Asokoro (Abuja).

---

## 🏛️ Strategic Architecture

### 1. Modern Multi-Tenant Stack
* **Frontend:** Next.js (App Router, Tailwind CSS, TypeScript). Clean, minimalist Swiss/Nordic architectural aesthetic.
* **Backend & Security:** PostgreSQL with Supabase Row Level Security (RLS). Multi-tenancy is strictly enforced across `landlord_id` and `property_id`.
* **Zero Public Directory:** No open public indexing of occupied residences or resident identities, ensuring complete privacy for high-net-worth families.

### 2. Automated Transaction-Level Split Engine (Paystack / Flutterwave Subaccounts)
* **Base Rent:** 90%–95% routes directly to the Landlord's verified Subaccount (`ACCT_...`), 5%–10% management retainer to Elevated Stay.
* **Service Charges:** 100% ring-fenced into the estate's dedicated Compound Facility Escrow account (dedicated power generators, solar BMS, reverse osmosis water purification, communal security).
* **Initial Brokerage / Legal Fees:** 100% routed to Elevated Stay Treasury.

### 3. Headless & Frictionless Philosophy
* Desktop audits for landlords and studio operations.
* Daily resident operations interface via WhatsApp triggers and 1-click mobile workflows:
  - 1-click visitor pre-clearance with 6-digit cryptographic passes and WhatsApp shareable links.
  - Photo/video maintenance ticketing with before/after contractor verification.
  - Downloadable/printable official branded PDF receipts with QR verification hashes.

---

## 🚀 Portals & Workflows

| Portal | URL Path | User Persona | Capabilities |
| :--- | :--- | :--- | :--- |
| **Public Vision** | `/` | Prospective Landlords & HNIs | Brand positioning, interactive asset yield simulator, private client magic link login |
| **Landlord Oversight** | `/landlord` | Property Owners (Passive View-Only) | Real-time income ledger, automated payout logs, lease countdowns, contractor repair audits |
| **Resident Hub** | `/resident` | Active Compound Tenants | Annexure lease terms (quiet hours 10 PM - 7 AM), 1-click visitor passes, PDF receipts, repair requests |
| **Studio Admin** | `/admin` | Elevation Operations Team | Compound/unit onboarding, contractor dispatch, platform-wide yield analytics, webhook simulator |

---

## 🗄️ Supabase Database & RLS Migration

The complete production-grade schema is located at:
```
supabase/schema.sql
```
It defines:
- Enums: `user_role_type`, `unit_status_type`, `transaction_type`, `payment_gateway`, `ticket_priority`, `pass_status`
- Tables: `compounds`, `landlords`, `units`, `residents`, `compound_regulations`, `transactions`, `visitor_passes`, `maintenance_tickets`
- RLS Policies: Strict row-level isolation ensuring landlords can only inspect their owned units, residents can only access their leased quarters, and unauthenticated public requests cannot query occupied compound data.

---

## 🛠️ Local Development & Production Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Compile production bundle
npm run build
```
