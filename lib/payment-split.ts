/**
 * Elevated Stay - Automated Split Routing & Escrow Calculation Engine
 * Integrates Paystack / Flutterwave Subaccount transaction routing logic.
 */

export interface SplitCalculationInput {
  baseRent: number;
  serviceCharge: number;
  legalBrokerageFee?: number;
  managementFeePercent?: number; // e.g. 7.5 = 7.5%
}

export interface SplitCalculationResult {
  totalCharge: number;
  breakdown: {
    baseRent: {
      total: number;
      landlordShare: number; // 90% - 95%
      elevationShare: number; // 5% - 10%
      percentageSplit: { landlord: number; elevation: number };
    };
    serviceCharge: {
      total: number;
      compoundEscrowShare: number; // 100% dedicated to compound facility maintenance
      elevationShare: 0;
    };
    legalBrokerage: {
      total: number;
      elevationShare: number; // 100%
      landlordShare: 0;
    };
  };
  destinationSummary: {
    landlordSubaccountPayout: number;
    compoundEscrowDeposit: number;
    elevationStudioTreasury: number;
  };
}

export function calculateTransactionSplit(
  input: SplitCalculationInput
): SplitCalculationResult {
  const managementFeePercent = input.managementFeePercent ?? 8; // Default 8%
  const landlordPercent = 100 - managementFeePercent;

  const baseRentTotal = input.baseRent;
  const landlordRentShare = Math.round((baseRentTotal * landlordPercent) / 100);
  const elevationRentShare = baseRentTotal - landlordRentShare;

  const serviceChargeTotal = input.serviceCharge;
  const escrowShare = serviceChargeTotal; // 100% to compound escrow

  const legalFeeTotal = input.legalBrokerageFee || 0;
  const elevationLegalShare = legalFeeTotal; // 100% to Elevated Stay

  const totalCharge = baseRentTotal + serviceChargeTotal + legalFeeTotal;

  return {
    totalCharge,
    breakdown: {
      baseRent: {
        total: baseRentTotal,
        landlordShare: landlordRentShare,
        elevationShare: elevationRentShare,
        percentageSplit: { landlord: landlordPercent, elevation: managementFeePercent },
      },
      serviceCharge: {
        total: serviceChargeTotal,
        compoundEscrowShare: escrowShare,
        elevationShare: 0,
      },
      legalBrokerage: {
        total: legalFeeTotal,
        elevationShare: elevationLegalShare,
        landlordShare: 0,
      },
    },
    destinationSummary: {
      landlordSubaccountPayout: landlordRentShare,
      compoundEscrowDeposit: escrowShare,
      elevationStudioTreasury: elevationRentShare + elevationLegalShare,
    },
  };
}

/**
 * Generates Paystack / Flutterwave subaccount payload for split transaction
 */
export function generatePaystackSplitPayload(params: {
  reference: string;
  amountInNaira: number;
  email: string;
  landlordSubaccountCode: string;
  compoundEscrowSubaccountCode: string;
  splitConfig: SplitCalculationResult;
}) {
  const amountInKobo = params.amountInNaira * 100;

  // Paystack subaccount split allocation
  return {
    reference: params.reference,
    amount: amountInKobo,
    email: params.email,
    currency: "NGN",
    subaccount: params.landlordSubaccountCode,
    bearer: "subaccount",
    transaction_charge: params.splitConfig.destinationSummary.elevationStudioTreasury * 100,
    metadata: {
      platform: "Elevated Stay (Asset Lifecycle Protection)",
      organization: "Elevation Studio",
      split_breakdown: {
        landlord_direct_payout_ngn: params.splitConfig.destinationSummary.landlordSubaccountPayout,
        compound_facility_escrow_ngn: params.splitConfig.destinationSummary.compoundEscrowDeposit,
        elevation_management_treasury_ngn: params.splitConfig.destinationSummary.elevationStudioTreasury,
      },
    },
  };
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount).replace("NGN", "₦");
}

