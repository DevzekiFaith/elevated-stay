# Elevated Stay (`stay.com.ng`)
### Turnkey Residential Management, Asset Lifecycle Protection & AI Escrow Auditing
*An Elevation Studio Initiative*

Elevated Stay is an architectural-grade PropTech operating system engineered for high-value family compounds, executive estates, and institutional diaspora investors across prime residential hubs (Ikoyi, Victoria Island, Banana Island, Lekki Phase 1, Maitama, Asokoro, Wuse II, and Old GRA Port Harcourt).

---

## 🏛️ Strategic Architecture & Core Pillars

### 1. Modern Multi-Tenant Stack
* **Frontend:** Next.js 16 (App Router, Tailwind CSS, TypeScript, Lucide Icons). Minimalist Swiss/Nordic architectural aesthetic.
* **Backend & Security:** PostgreSQL with Supabase Row Level Security (RLS). Multi-tenancy is strictly enforced across `landlord_id` and `property_id`.
* **Zero Public Directory:** No open public indexing of occupied residences or resident identities, ensuring sovereign privacy for high-net-worth families.
* **Master Security Gate:** Client Security Vault with dual-layer credentials (cryptographic Passcode & Master Security PIN), role-based permissions, and tamper-evident audit logs.

### 2. Automated Transaction-Level Split Engine
* **Base Rent:** 90%–95% routes directly to the Landlord's verified Subaccount (`ACCT_...`), 5%–10% management retainer to Elevated Stay Treasury.
* **Service Charges:** 100% ring-fenced into the estate's dedicated Compound Facility Escrow account (dedicated power generators, solar BMS, reverse osmosis water purification, communal security).
* **Initial Brokerage / Legal Fees:** 100% routed to Elevated Stay Treasury.
* **Escrow Protection:** Funds cannot be disbursed without matching maintenance work orders and verified contractor audit proof.

### 3. AI Contractor Inspection & Escrow Audit Engine
* **Computer Vision Workmanship Analysis:** Analyzes Before vs. After remediation imagery, pixel continuity, thermal signature gradients, and physical remediation status.
* **Fair Market Rate Sanity Benchmarking:** Audits contractor line-item invoices against empirical Lagos/Abuja market rates (e.g., Daikin VRV sensor boards, R410A refrigerant charge, Schneider ATS contactors, Dow FilmTec RO membranes).
* **Statutory Compliance & FIRS Withholding:** Automatically calculates 5% statutory withholding tax (WHT) for FIRS compliance, authorizes the 95% net contractor wire, and generates a Quantity Surveyor (QS) audit certificate with an immutable SHA-256 hash.

### 4. Headless & Frictionless Resident Experience
* **Annexure Quiet Hours Code:** Automatically generated alphanumeric verification code (`ES-QH-...`) binding lease rules (10:00 PM – 07:00 AM generator/sound protocol) directly to tenant identity.
* **1-Click Visitor Passes:** 6-digit cryptographic gate clearance codes shareable via WhatsApp with automatic QR verification and real-time security gate logging.
* **Interactive Inspection Sliders:** Dual-layer before/after visual inspection sliders with embedded AI audit diagnostics across HVAC, Solar Inverters, and Water Purification.
* **Multi-View Compound Image Slides:** Client compound profiles feature multi-photo slide decks (Cover, Front Elevation, Aerial, Interior, Mechanical Bay) with carousel controls and full-screen lightbox preview.

---

## 🚀 Portals & Workflows

| Portal | URL Path | User Persona | Core Capabilities |
| :--- | :--- | :--- | :--- |
| **Public Portal & Vision** | `/` | Prospective Landlords, HNIs, Diaspora Investors | Brand positioning, interactive asset yield simulator, dynamic before/after engineering showcase, private client magic link login |
| **Landlord Oversight** | `/landlord` | Property Owners & Family Principals | Real-time rental income ledger, automated payout subaccounts, facility escrow balance monitor, interactive repair audit sliders, tenant lease countdowns |
| **Resident Hub** | `/resident` | Active Compound Tenants & Family Quarters | Annexure lease terms (quiet hours 10 PM - 7 AM), 1-click WhatsApp visitor passes, instant maintenance ticket dispatch with AI pre-scan, branded payment receipts |
| **Operations Desk** | `/admin` | Elevation Operations & Engineering Team | Compound/unit onboarding with image slide deck manager, contractor ticket dispatch with AI Escrow Audit Modal, Client Security Vault with credential generation & printable Onboarding Folios |

---

## 🤖 AI Escrow Audit Engine Reference

The AI verification system is powered by [`lib/ai-escrow-auditor.ts`](file:///c:/Users/USER/Desktop/Asset%20Protection/elevation-stay/lib/ai-escrow-auditor.ts) and the [`AiEscrowAuditModal`](file:///c:/Users/USER/Desktop/Asset%20Protection/elevation-stay/components/AiEscrowAuditModal.tsx) component:

```
[Contractor Submits Work Order & Invoice]
                  │
                  ▼
   ┌──────────────────────────────┐
   │ 1. Computer Vision Analysis  │ ──► Checks pixel continuity, anomaly remediation & thermal gradient
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ 2. Line-Item Invoice Audit   │ ──► Compares billed parts & labor vs. Nigerian regional benchmarks
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ 3. Quantity Surveyor Check   │ ──► Computes 5% statutory FIRS WHT and net 95% contractor wire
   └──────────────┬───────────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ 4. Escrow Release Execution  │ ──► Admin authorizes disbursement; immutable audit hash recorded
   └──────────────────────────────┘
```

### Market Benchmark Categories Supported:
- **HVAC & VRV Chiller Systems**: Daikin VRV inverter boards, R410A gas re-charge, thermostatic expansion valves, coil deep flush.
- **Electrical & Inverter Infrastructure**: Schneider Electric ATS 250A contactors, 15kVA Felicity LiFePO4 BMS cell balancing, deep-cycle surge suppressors.
- **Plumbing & Reverse Osmosis**: Dow FilmTec 4040 industrial membranes, Philips 55W germicidal UV lamps, Grundfos booster pump impellers.

---

## 🔐 Client Security Vault & Onboarding Protocol

The system manages client security through [`lib/client-vault.ts`](file:///c:/Users/USER/Desktop/Asset%20Protection/elevation-stay/lib/client-vault.ts):

1. **Dual-Layer Access Keys**:
   - High-entropy cryptographic passkey (e.g., `ES-VI-7921-X9`)
   - 4-digit Master Security PIN (e.g., `8421`)
2. **Automated Annexure Quiet Hours Code**:
   - Formatted as `ES-QH-[Initials]-[RandomHex]` (e.g., `ES-QH-AO-7842`).
   - Legally binds client identity to compound rules (10 PM – 7 AM silent operation).
3. **Dispatch Options**:
   - **VIP WhatsApp Concierge**: Instant one-click direct dispatch to client via encrypted WhatsApp link.
   - **Tamper-Evident Physical Folio**: Generates a high-contrast printable document complete with QR login tokens, passcodes, and physical handover signatures.

---

## 🗄️ Database Architecture & RLS Policies

The complete production-grade schema is located at [`supabase/schema.sql`](file:///c:/Users/USER/Desktop/Asset%20Protection/elevation-stay/supabase/schema.sql):

- **Key Tables**: `compounds`, `landlords`, `units`, `residents`, `compound_regulations`, `transactions`, `visitor_passes`, `maintenance_tickets`
- **Security**: Strict Row-Level Security (RLS) policies preventing cross-tenant data leakage. Unauthenticated requests are blocked from viewing occupied compound coordinates and resident profiles.

---

## 🛠️ Local Development & Production Verification

```bash
# Navigate to application directory
cd elevation-stay

# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Compile production bundle
npm run build
```
