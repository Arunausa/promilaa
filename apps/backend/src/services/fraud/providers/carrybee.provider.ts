import { FraudProvider, FraudCheckResult, FraudRiskLevel } from '../provider.interface';

export class CarrybeeProvider implements FraudProvider {
  readonly name = 'CarryBee';

  async checkPhone(phoneNumber: string): Promise<FraudCheckResult> {
    const apiPhone = process.env.CARRYBEE_PHONE;
    const apiPassword = process.env.CARRYBEE_PASSWORD;

    if (!apiPhone || !apiPassword) {
      throw new Error('CarryBee credentials not configured');
    }

    try {
      // Stubbing Carrybee API Call
      const response = await fetch('https://api.carrybee.com.bd/v1/customer-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiPassword // Stubbed auth
        },
        body: JSON.stringify({ phone: phoneNumber }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`CarryBee API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assume CarryBee returns { result: 'success', risk_level_score: 10 }
      const riskScore = data.risk_level_score || 0;
      let status: FraudRiskLevel = 'UNKNOWN';

      if (riskScore <= 30) status = 'LOW';
      else if (riskScore <= 70) status = 'MEDIUM';
      else if (riskScore <= 100) status = 'HIGH';

      return {
        status,
        riskScore,
        provider: this.name,
        rawData: data,
        reason: riskScore > 30 ? `CarryBee reported risk score of ${riskScore}` : undefined,
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error checking phone: ${error.message}`);
      throw error;
    }
  }
}
