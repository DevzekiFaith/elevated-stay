-- ==============================================================================
-- ELEVATION STAY (www.stay.com.ng)
-- Turnkey Residential Management & Asset Lifecycle Protection
-- Multi-Tenant Database Architecture & Row Level Security (PostgreSQL / Supabase)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerated Domain Types
CREATE TYPE user_role_type AS ENUM ('admin', 'landlord', 'resident');
CREATE TYPE unit_status_type AS ENUM ('occupied', 'vacant', 'maintenance');
CREATE TYPE transaction_type AS ENUM ('base_rent', 'service_charge', 'legal_brokerage', 'diesel_levy');
CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed', 'processing');
CREATE TYPE payment_gateway AS ENUM ('paystack', 'flutterwave');
CREATE TYPE ticket_priority AS ENUM ('emergency', 'high', 'routine');
CREATE TYPE ticket_status AS ENUM ('reported', 'assessed', 'contractor_dispatched', 'completed');
CREATE TYPE pass_status AS ENUM ('active', 'used', 'expired');

-- 3. Compounds (Estates / Multi-Family Compounds)
CREATE TABLE compounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    street_address TEXT NOT NULL,
    neighborhood VARCHAR(128) NOT NULL,
    city VARCHAR(64) NOT NULL DEFAULT 'Lagos',
    total_units INTEGER NOT NULL DEFAULT 1,
    escrow_account_number VARCHAR(64) NOT NULL,
    escrow_bank VARCHAR(128) NOT NULL,
    escrow_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    quiet_hours_start TIME NOT NULL DEFAULT '22:00:00',
    quiet_hours_end TIME NOT NULL DEFAULT '07:00:00',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Landlords (Passive Oversight Investors)
CREATE TABLE landlords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    subaccount_code VARCHAR(128) NOT NULL, -- Paystack / Flutterwave Subaccount Code (e.g. ACCT_...)
    bank_name VARCHAR(128) NOT NULL,
    account_number VARCHAR(32) NOT NULL,
    management_fee_percent NUMERIC(5, 2) NOT NULL DEFAULT 7.50, -- 5.0% to 10.0%
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Compound Units (Individual Luxury Residences)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE RESTRICT,
    landlord_id UUID NOT NULL REFERENCES landlords(id) ON DELETE RESTRICT,
    unit_number VARCHAR(64) NOT NULL,
    unit_type VARCHAR(128) NOT NULL,
    floor_level VARCHAR(64),
    annual_rent NUMERIC(15, 2) NOT NULL,
    annual_service_charge NUMERIC(15, 2) NOT NULL,
    legal_brokerage_fee NUMERIC(15, 2) NOT NULL,
    status unit_status_type NOT NULL DEFAULT 'vacant',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_compound_unit UNIQUE (compound_id, unit_number)
);

-- 6. Residents / Tenants (Headless Mobile Experience)
CREATE TABLE residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    annexure_signed BOOLEAN NOT NULL DEFAULT FALSE,
    annexure_signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Compound Regulations (Annexure Terms)
CREATE TABLE compound_regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    clause_key VARCHAR(64) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Financial Ledger & Split Transactions (Paystack / Flutterwave Subaccount Routing)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(128) UNIQUE NOT NULL,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE RESTRICT,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE RESTRICT,
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE RESTRICT,
    landlord_id UUID NOT NULL REFERENCES landlords(id) ON DELETE RESTRICT,
    transaction_type transaction_type NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    landlord_split_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,      -- 90% - 95% Base Rent
    management_split_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,    -- 5% - 10% Elevation Fee
    escrow_split_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,        -- 100% Service Charge
    gateway payment_gateway NOT NULL DEFAULT 'paystack',
    gateway_reference VARCHAR(128),
    landlord_subaccount VARCHAR(128) NOT NULL,
    escrow_account_number VARCHAR(64) NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    channel VARCHAR(32) DEFAULT 'bank_transfer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Visitor Passes (1-Click Pre-Clearance & WhatsApp Triggers)
CREATE TABLE visitor_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(16) UNIQUE NOT NULL, -- e.g. 'EST-849204'
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE CASCADE,
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    guest_name VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(32) NOT NULL,
    vehicle_plate VARCHAR(32),
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    status pass_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Maintenance Audit Logs (Preventive & Corrective Asset Lifecycle)
CREATE TABLE maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    compound_id UUID NOT NULL REFERENCES compounds(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES residents(id) ON DELETE RESTRICT,
    category VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'routine',
    status ticket_status NOT NULL DEFAULT 'reported',
    before_photo_url TEXT NOT NULL,
    after_photo_url TEXT,
    contractor_name VARCHAR(255),
    invoice_amount NUMERIC(15, 2),
    paid_from_escrow BOOLEAN NOT NULL DEFAULT TRUE,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    contractor_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MULTI-TENANT QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX idx_units_compound ON units(compound_id);
CREATE INDEX idx_units_landlord ON units(landlord_id);
CREATE INDEX idx_residents_compound ON residents(compound_id);
CREATE INDEX idx_residents_unit ON residents(unit_id);
CREATE INDEX idx_tx_landlord ON transactions(landlord_id);
CREATE INDEX idx_tx_compound ON transactions(compound_id);
CREATE INDEX idx_tx_resident ON transactions(resident_id);
CREATE INDEX idx_passes_code ON visitor_passes(code);
CREATE INDEX idx_tickets_compound ON maintenance_tickets(compound_id);
CREATE INDEX idx_tickets_unit ON maintenance_tickets(unit_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict multi-tenant isolation via landlord_id and property_id (compound/unit)
-- ==============================================================================

ALTER TABLE compounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE compound_regulations ENABLE ROW LEVEL SECURITY;

-- Helper functions for role & tenant checking
CREATE OR REPLACE FUNCTION auth_user_id() RETURNS UUID AS $$
    SELECT auth.uid();
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_elevation_admin() RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data->>'role' = 'admin'
    );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_current_landlord_id() RETURNS UUID AS $$
    SELECT id FROM landlords WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION get_current_resident_id() RETURNS UUID AS $$
    SELECT id FROM residents WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- ------------------------------------------------------------------------------
-- 1. Compounds RLS: No open public browsing of residential estates
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to compounds"
    ON compounds FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Landlords can view compounds where they own units"
    ON compounds FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM units
            WHERE units.compound_id = compounds.id
            AND units.landlord_id = get_current_landlord_id()
        )
    );

CREATE POLICY "Residents can view their own compound"
    ON compounds FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM residents
            WHERE residents.compound_id = compounds.id
            AND residents.id = get_current_resident_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 2. Landlords RLS: Read-only access to own profile
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to landlords"
    ON landlords FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Landlords can view own profile"
    ON landlords FOR SELECT
    USING (id = get_current_landlord_id());

-- ------------------------------------------------------------------------------
-- 3. Units RLS: Isolated by landlord_id and resident_id
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to units"
    ON units FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Landlords can view only their owned units"
    ON units FOR SELECT
    USING (landlord_id = get_current_landlord_id());

CREATE POLICY "Residents can view only their assigned unit"
    ON units FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM residents
            WHERE residents.unit_id = units.id
            AND residents.id = get_current_resident_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 4. Transactions Ledger RLS: Strictly isolated financial audits
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to transactions"
    ON transactions FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Landlords view-only transactions for their properties"
    ON transactions FOR SELECT
    USING (landlord_id = get_current_landlord_id());

CREATE POLICY "Residents view-only their own payment receipts"
    ON transactions FOR SELECT
    USING (resident_id = get_current_resident_id());

-- ------------------------------------------------------------------------------
-- 5. Maintenance Tickets RLS: Landlords have passive audit, Residents can report
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins have full access to maintenance tickets"
    ON maintenance_tickets FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Landlords view completed repair photos and audit logs"
    ON maintenance_tickets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM units
            WHERE units.id = maintenance_tickets.unit_id
            AND units.landlord_id = get_current_landlord_id()
        )
    );

CREATE POLICY "Residents view and create tickets for their unit"
    ON maintenance_tickets FOR ALL
    USING (resident_id = get_current_resident_id())
    WITH CHECK (resident_id = get_current_resident_id());

-- ------------------------------------------------------------------------------
-- 6. Visitor Passes RLS: Headless gate pre-clearance
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins view all visitor passes"
    ON visitor_passes FOR ALL
    USING (is_elevation_admin());

CREATE POLICY "Residents manage their own visitor passes"
    ON visitor_passes FOR ALL
    USING (resident_id = get_current_resident_id())
    WITH CHECK (resident_id = get_current_resident_id());

-- ------------------------------------------------------------------------------
-- 7. Compound Regulations RLS: Transparent peaceful residency terms
-- ------------------------------------------------------------------------------
CREATE POLICY "Everyone authenticated can view their compound regulations"
    ON compound_regulations FOR SELECT
    USING (
        is_elevation_admin()
        OR EXISTS (
            SELECT 1 FROM residents
            WHERE residents.compound_id = compound_regulations.compound_id
            AND residents.id = get_current_resident_id()
        )
        OR EXISTS (
            SELECT 1 FROM units
            WHERE units.compound_id = compound_regulations.compound_id
            AND units.landlord_id = get_current_landlord_id()
        )
    );

