import { FraudProvider, FraudCheckResult, FraudRiskLevel } from '../provider.interface';

export class SteadfastProvider implements FraudProvider {
  readonly name = 'Steadfast';

  async checkPhone(phoneNumber: string): Promise<FraudCheckResult> {
    const apiUser = process.env.STEADFAST_USER;
    const apiPassword = process.env.STEADFAST_PASSWORD;

    if (!apiUser || !apiPassword) {
      throw new Error('Steadfast credentials not configured');
    }

    try {
      // Stubbing the actual API call logic based on typical Steadfast endpoints.
      // Usually it involves getting a token first, then querying the phone.
      
      const response = await fetch('https://api.steadfast.com.bd/v1/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiPassword,
          'Api-Secret': apiUser,
        },
        body: JSON.stringify({ phone: phoneNumber }),
        // Set a timeout of 5 seconds as per documentation
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Steadfast API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assume Steadfast returns { success: true, return_ratio: 0.35, risk_score: 80 }
      const riskScore = data.risk_score || 0;
      let status: FraudRiskLevel = 'UNKNOWN';

      if (riskScore <= 30) status = 'LOW';
      else if (riskScore <= 70) status = 'MEDIUM';
      else if (riskScore <= 100) status = 'HIGH';

      return {
        status,
        riskScore,
        provider: this.name,
        rawData: data,
        reason: riskScore > 30 ? `Steadfast reported risk score of ${riskScore}` : undefined,
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error checking phone: ${error.message}`);
      throw error; // Let the Decision Engine catch and try the next provider
    }
  }
}
