import { FraudProvider, FraudCheckResult, FraudRiskLevel } from '../provider.interface';

export class PaperflyProvider implements FraudProvider {
  readonly name = 'Paperfly';

  async checkPhone(phoneNumber: string): Promise<FraudCheckResult> {
    const apiUser = process.env.PAPERFLY_USER;
    const apiPassword = process.env.PAPERFLY_PASSWORD;

    if (!apiUser || !apiPassword) {
      throw new Error('Paperfly credentials not configured');
    }

    try {
      // Stubbing Paperfly API Call
      const response = await fetch('https://api.paperfly.com.bd/v1/verify-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${apiUser}:${apiPassword}`).toString('base64')}`
        },
        body: JSON.stringify({ customer_phone: phoneNumber }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Paperfly API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assume Paperfly returns { success: true, return_probability: 20 }
      const riskScore = data.return_probability || 0;
      let status: FraudRiskLevel = 'UNKNOWN';

      if (riskScore <= 30) status = 'LOW';
      else if (riskScore <= 70) status = 'MEDIUM';
      else if (riskScore <= 100) status = 'HIGH';

      return {
        status,
        riskScore,
        provider: this.name,
        rawData: data,
        reason: riskScore > 30 ? `Paperfly reported risk score of ${riskScore}` : undefined,
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error checking phone: ${error.message}`);
      throw error;
    }
  }
}
