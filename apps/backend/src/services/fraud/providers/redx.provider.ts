import { FraudProvider, FraudCheckResult, FraudRiskLevel } from '../provider.interface';

export class RedxProvider implements FraudProvider {
  readonly name = 'RedX';

  async checkPhone(phoneNumber: string): Promise<FraudCheckResult> {
    const apiPhone = process.env.REDX_PHONE;
    const apiPassword = process.env.REDX_PASSWORD;

    if (!apiPhone || !apiPassword) {
      throw new Error('RedX credentials not configured');
    }

    try {
      // Stubbing RedX API Call
      const response = await fetch('https://api.redx.com.bd/v1/fraud-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiPassword}` // Stubbed auth
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`RedX API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assume RedX returns { status: 'success', fraud_percent: 40 }
      const riskScore = data.fraud_percent || 0;
      let status: FraudRiskLevel = 'UNKNOWN';

      if (riskScore <= 30) status = 'LOW';
      else if (riskScore <= 70) status = 'MEDIUM';
      else if (riskScore <= 100) status = 'HIGH';

      return {
        status,
        riskScore,
        provider: this.name,
        rawData: data,
        reason: riskScore > 30 ? `RedX reported risk score of ${riskScore}` : undefined,
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error checking phone: ${error.message}`);
      throw error;
    }
  }
}
