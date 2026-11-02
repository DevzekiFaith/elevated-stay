export type UserRole = "resident" | "landlord" | "admin";

export interface Compound {
  id: string;
  name: string;
  code: string;
  location: string;
  neighborhood: string;
  city: string;
  state: string;
  totalUnits: number;
  occupiedUnits: number;
  escrowBalance: number;
  escrowAccountNumber: string;
  escrowBank: string;
  imageUrl: string;
  images?: string[];
  quietHours: string;
}

export interface Unit {
  id: string;
  compoundId: string;
  unitNumber: string;
  type: string;
  floor: string;
  landlordId: string;
  currentResidentId?: string;
  annualRent: number;
  serviceCharge: number;
  legalBrokerageFee: number;
  status: "occupied" | "vacant" | "maintenance";
}

export interface Landlord {
  id: string;
  name: string;
  clientType?: "Residential Family Compound" | "Grade-A Commercial Office" | "Mixed-Use Prime Asset";
  organizationName?: string;
  email: string;
  phone: string;
  subaccountCode: string; // Paystack / Flutterwave subaccount
  bankName: string;
  accountNumber: string;
  managementFeePercent: number; // e.g. 7.5%
  totalAnnualYield: number;
  propertiesCount: number;
  primaryLocation?: string;
}

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  compoundId: string;
  unitId: string;
  unitName: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentStatus: "paid" | "due_soon" | "overdue";
  serviceChargeStatus: "paid" | "due_soon" | "overdue";
  annexureSigned: boolean;
  annexureSignedDate: string;
}

export interface Transaction {
  id: string;
  reference: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitName: string;
  compoundId: string;
  type: "base_rent" | "service_charge" | "legal_brokerage" | "diesel_levy";
  totalAmount: number;
  landlordSplitAmount: number;
  managementSplitAmount: number;
  escrowSplitAmount: number;
  provider: "paystack" | "flutterwave";
  landlordSubaccount: string;
  escrowAccount: string;
  status: "success" | "pending" | "processing";
  createdAt: string;
  channel: "card" | "bank_transfer" | "ussd";
}

export interface VisitorPass {
  id: string;
  code: string;
  guestName: string;
  guestPhone: string;
  residentId: string;
  residentName: string;
  unitName: string;
  compoundName: string;
  validFrom: string;
  validUntil: string;
  status: "active" | "used" | "expired";
  vehiclePlate?: string;
  whatsappMessageUrl?: string;
}

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  unitName: string;
  compoundId: string;
  compoundName: string;
  residentId: string;
  residentName: string;
  category: "HVAC & AC" | "Electrical & Inverter" | "Plumbing & Borehole" | "Structural / Carpentry" | "Access Control";
  title: string;
  description: string;
  priority: "emergency" | "high" | "routine";
  status: "reported" | "assessed" | "contractor_dispatched" | "completed";
  beforePhotoUrl: string;
  afterPhotoUrl?: string;
  contractorName?: string;
  contractorInvoiceAmount?: number;
  invoiceAmount?: number;
  contractorPaidFromEscrow: boolean;
  reportedAt: string;
  resolvedAt?: string;
  contractorNotes?: string;
}

export interface RegionalOffice {
  id: string;
  hubName: string;
  state: string;
  city: string;
  officeAddress: string;
  phone: string;
  leadEngineer: string;
  licensedContractorsCount: number;
  compoundsUnderWatch: number;
  facilityEscrowPool: number;
  coverageZones: string[];
  isFlagship?: boolean;
}

export interface IoTTelemetry {
  generatorFuelLiters: number;
  generatorFuelCapacity: number;
  generatorRunningHours: number;
  generatorRunStatus: "online" | "standby" | "maintenance";
  solarBatterySoC: number; // percentage
  solarGridSwitchoverMs: number;
  solarDailyHarvestKwh: number;
  solarBmsStatus: "optimal" | "balancing" | "advisory";
  waterTdsPpm: number;
  waterUvActive: boolean;
  waterDailyVolumeLiters: number;
  waterStatus: "potable_gold" | "filtration_active" | "filter_alert";
  lastSyncTimestamp: string;
}
