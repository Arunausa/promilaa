import { FraudProvider, FraudCheckResult, FraudRiskLevel } from '../provider.interface';

export class PathaoProvider implements FraudProvider {
  readonly name = 'Pathao';

  async checkPhone(phoneNumber: string): Promise<FraudCheckResult> {
    const apiUser = process.env.PATHAO_USER;
    const apiPassword = process.env.PATHAO_PASSWORD;

    if (!apiUser || !apiPassword) {
      throw new Error('Pathao credentials not configured');
    }

    try {
      const response = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/issue-tracker/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiPassword}` // Stubbed auth mechanism
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`Pathao API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assume Pathao returns { code: 200, data: { fraud_score: 15 } }
      const riskScore = data.data?.fraud_score || 0;
      let status: FraudRiskLevel = 'UNKNOWN';

      if (riskScore <= 30) status = 'LOW';
      else if (riskScore <= 70) status = 'MEDIUM';
      else if (riskScore <= 100) status = 'HIGH';

      return {
        status,
        riskScore,
        provider: this.name,
        rawData: data,
        reason: riskScore > 30 ? `Pathao reported risk score of ${riskScore}` : undefined,
      };

    } catch (error: any) {
      console.error(`[${this.name}] Error checking phone: ${error.message}`);
      throw error;
    }
  }
}
