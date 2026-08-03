export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface FraudCheckResult {
  status: FraudRiskLevel;
  riskScore: number;
  reason?: string;
  provider: string;
  rawData?: any;
}

export interface FraudProvider {
  /**
   * The name of the provider (e.g. 'Pathao', 'Steadfast')
   */
  readonly name: string;

  /**
   * Checks the fraud status of a phone number
   * @param phoneNumber The phone number to check
   * @returns A standard FraudCheckResult
   */
  checkPhone(phoneNumber: string): Promise<FraudCheckResult>;
}
