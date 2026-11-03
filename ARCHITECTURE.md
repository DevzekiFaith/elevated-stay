# Elevated Stay — System Architecture & Technical Specifications

This document provides a comprehensive technical breakdown of the Elevated Stay platform, detailing data models, payment split routing, escrow audit algorithms, client security vault workflows, and UI component architecture.

---

## 1. Directory Structure & Key Files

```
elevation-stay/
├── app/
│   ├── layout.tsx                # Root layout with ToastProvider & font setup
│   ├── page.tsx                  # Public portal: Asset yield simulator, engineering showcase, magic link
│   ├── landlord/
│   │   └── page.tsx              # Landlord Oversight Desk: Escrow telemetry, yield metrics, repair audits
│   ├── resident/
│   │   └── page.tsx              # Resident Hub: Annexure quiet hours, visitor pass generation, ticket status
│   └── admin/
│       └── page.tsx              # Master Operations: Compound onboarding, slide manager, ticket audit, client vault
├── components/
│   ├── AiEscrowAuditModal.tsx    # 3-tab HUD: Computer vision diagnostics, invoice sanity audit, escrow release
│   ├── CompoundImageCarousel.tsx # Multi-photo building slide deck with cover badge, thumbs & full-screen lightbox
│   ├── InspectionSlider.tsx      # Dual-layer before/after visual inspection slider with embedded AI modal
│   ├── MaintenanceTicketModal.tsx# Resident ticket creation modal with AI pre-scan protocol
│   ├── SplitFlowVisualizer.tsx   # Interactive 3-way split transaction diagram
│   ├── PushNotificationManager.tsx # Web push notification subscriber for emergency alerts & payouts
│   ├── Navbar.tsx                # Universal top navigation bar with dynamic active-state indicators
│   ├── Footer.tsx                # Elevated Stay architectural footer
│   └── ToastProvider.tsx         # Context-driven notifications (finance, security, maintenance, system)
├── lib/
│   ├── ai-escrow-auditor.ts      # Deterministic AI inspection & market benchmark auditing engine
│   ├── client-vault.ts           # Client security vault, credentials generator & Annexure Quiet Hours code
│   ├── compound-vault.ts         # Compound registry, local storage persistence & clean live state
│   ├── payment-split.ts          # Paystack/Flutterwave split calculation (90% rent / 100% escrow)
│   ├── types.ts                  # TypeScript definitions for compounds, tickets, transactions, vaults
│   └── utils.ts                  # Tailwind class merge utilities
└── supabase/
    └── schema.sql                # Production PostgreSQL database schema with strict RLS policies
```

---

## 2. Split Transaction & Escrow Logic

Elevated Stay enforces strict transaction segregation:

$$\text{Base Rent} = 90\% \text{ to Landlord Subaccount} + 10\% \text{ Management Fee to Studio}$$

$$\text{Service Charge} = 100\% \text{ to Compound Facility Escrow Subaccount}$$

$$\text{Brokerage \& Legal} = 100\% \text{ to Studio Treasury}$$

### Escrow Disbursement Rule:
Funds locked in the **Compound Facility Escrow** cannot be released to any third-party service provider without an authorized work order and a verified AI Workmanship & Invoice Audit report.

---

## 3. AI Escrow & Workmanship Auditing Algorithm

The auditing engine in [`lib/ai-escrow-auditor.ts`](file:///c:/Users/USER/Desktop/Asset%20Protection/elevation-stay/lib/ai-escrow-auditor.ts) performs three consecutive checks:

### Step 1: Computer Vision Workmanship Verification
- Calculates pixel continuity match score between baseline Before imagery and post-repair After imagery.
- Verifies physical defect remediation (e.g., condensation leak resolved, burn mark removed, sediment cleared).
- Detects anomalies and ensures thermal continuity gradients match standard operating tolerances.

### Step 2: Fair Market Line-Item Sanity Benchmarking
Each invoice item submitted by the contractor is matched against localized market price indices:
- **Baseline Cost:** Benchmark cost for parts and certified technical labor in Lagos/Abuja.
- **Tolerance Threshold:** Allowable markup window (typically $\le 10\%$).
- **Variance Warning:** If variance exceeds $+15\%$, the audit flags the line-item as an overbilling risk and blocks one-click disbursement.

### Step 3: Statutory Tax & Escrow Release Execution
- **Gross Invoice Amount:** $A_{\text{gross}}$
- **FIRS Statutory Withholding Tax (WHT):** $5\%$ deduction:
  $$WHT = A_{\text{gross}} \times 0.05$$
- **Net Contractor Disbursement:**
  $$A_{\text{net}} = A_{\text{gross}} - WHT = A_{\text{gross}} \times 0.95$$
- **Audit Hash:** Generated as `SHA256:ES-AI-[Category]-[Timestamp]-QS98` for tamper-evident record keeping.

---

## 4. Client Security Vault & Sovereign Privacy

High-net-worth family principals and diaspora property owners demand complete discretion:

### 1. Zero Public Directory Protocol
- Compound addresses, occupant identities, and unit numbers are strictly omitted from public routes.
- Units are referred to by private architectural codenames (e.g., *Penthouse Obsidian*, *Villa Acacia*).

### 2. Dual-Layer Credential System
- **Passkey:** Cryptographic format `ES-[CityCode]-[4Digits]-[Hex]` (e.g., `ES-LA-9021-F3`).
- **Master Security PIN:** 4-digit secondary authentication factor.

### 3. Annexure Quiet Hours Code
- Formatted as `ES-QH-[ClientInitials]-[4Hex]` (e.g., `ES-QH-BM-3912`).
- Legally covenants that generator and heavy machinery acoustic emissions are silenced between **10:00 PM and 07:00 AM**, preserving compound tranquility.

### 4. Dispatch Channels
- **WhatsApp Concierge Link:** Generated using direct API format (`https://wa.me/[Phone]?text=...`).
- **Physical Executive Folio:** Branded printable folio designed with secure print stylesheet (`@media print`), watermarked logo, QR access code, and security foil signature field.

---

## 5. UI/UX Philosophy: Architectural Minimalist

- **Color Palette:**
  - Deep Obsidian Canvas: `#080A0E`, `#0D1117`, `#121722`
  - High-Value Metallic Gold Accents: `#C2A774`, `#DFCA9E`, `#E5C158`
  - Crisp Structural Accents: Emerald `#10B981`, Cyan `#06B6D4`, Amber `#F59E0B`
- **Typography:** Inter with monospace accents for financial figures, subaccounts, and cryptographic hashes.
- **Responsiveness:** Full mobile responsiveness with tactile bottom sheets and high-contrast desktop HUDs.
