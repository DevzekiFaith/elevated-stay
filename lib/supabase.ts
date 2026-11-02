import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project.supabase.co"
  );
};

// Typed Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseCompoundRow {
  id: string;
  code: string;
  name: string;
  street_address: string;
  neighborhood: string;
  city: string;
  total_units: number;
  escrow_account_number: string;
  escrow_bank: string;
  escrow_balance: number;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export interface SupabaseUnitRow {
  id: string;
  compound_id: string;
  landlord_id: string;
  unit_number: string;
  unit_type: string;
  floor_level: string;
  annual_rent: number;
  annual_service_charge: number;
  legal_brokerage_fee: number;
  status: "occupied" | "vacant" | "maintenance";
}

export interface SupabaseTransactionRow {
  id: string;
  reference: string;
  resident_id: string;
  unit_id: string;
  compound_id: string;
  landlord_id: string;
  transaction_type: "base_rent" | "service_charge" | "legal_brokerage" | "diesel_levy";
  total_amount: number;
  landlord_split_amount: number;
  management_split_amount: number;
  escrow_split_amount: number;
  gateway: "paystack" | "flutterwave";
  landlord_subaccount: string;
  escrow_account_number: string;
  status: "pending" | "success" | "failed" | "processing";
  channel: string;
  created_at: string;
}

