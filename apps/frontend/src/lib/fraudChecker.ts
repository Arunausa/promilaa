import prisma from '@/lib/prisma';

export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface FraudCheckResult {
  status: FraudRiskLevel;
  riskScore: number;
  reason?: string;
  provider: string;
  rawData?: any;
}

/**
 * Multi-Courier Fraud Checking Engine
 * Replicates AbiruzzamanMolla/Fraud-Checker-BD-Courier-Laravel logic in TypeScript
 */
export async function checkPhoneNumberFraud(phone: string, orderId?: string): Promise<FraudCheckResult> {
  const cleanPhone = phone.trim();

  // 1. Internal Order History Check (Previous returned/cancelled orders)
  const previousOrders = await prisma.order.findMany({
    where: { guestPhone: cleanPhone },
    select: { status: true },
  });

  const cancelledCount = previousOrders.filter(o => o.status === 'CANCELLED' || o.status === 'RETURNED').length;

  if (cancelledCount >= 2) {
    return saveAndReturn(cleanPhone, {
      status: 'HIGH',
      riskScore: 90,
      provider: 'Promilaa Internal Database',
      reason: `Customer has ${cancelledCount} previously cancelled/returned orders! High Risk!`,
      rawData: { cancelledCount },
    }, orderId);
  }

  // 2. Steadfast Courier Check
  const steadfastUser = process.env.STEADFAST_USER;
  const steadfastPassword = process.env.STEADFAST_PASSWORD;

  if (steadfastUser && steadfastPassword) {
    try {
      const res = await fetch('https://api.steadfast.com.bd/v1/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': steadfastPassword,
          'Api-Secret': steadfastUser,
        },
        body: JSON.stringify({ phone: cleanPhone }),
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        const riskScore = data.risk_score || data.fraud_score || 0;
        let status: FraudRiskLevel = 'LOW';
        if (riskScore > 70) status = 'HIGH';
        else if (riskScore > 30) status = 'MEDIUM';

        return saveAndReturn(cleanPhone, {
          status,
          riskScore,
          provider: 'Steadfast Courier',
          reason: riskScore > 30 ? `Steadfast reported risk score of ${riskScore}` : 'Steadfast check passed',
          rawData: data,
        }, orderId);
      }
    } catch (e) {
      console.warn('Steadfast check skipped or failed:', e);
    }
  }

  // 3. Pathao Courier Check
  const pathaoUser = process.env.PATHAO_USER;
  const pathaoPassword = process.env.PATHAO_PASSWORD;

  if (pathaoUser && pathaoPassword) {
    try {
      const res = await fetch('https://api-hermes.pathao.com/aladdin/api/v1/issue-tracker/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pathaoPassword}`,
        },
        body: JSON.stringify({ phone_number: cleanPhone }),
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        const riskScore = data.data?.fraud_score || 0;
        let status: FraudRiskLevel = 'LOW';
        if (riskScore > 70) status = 'HIGH';
        else if (riskScore > 30) status = 'MEDIUM';

        return saveAndReturn(cleanPhone, {
          status,
          riskScore,
          provider: 'Pathao Courier',
          reason: riskScore > 30 ? `Pathao reported risk score of ${riskScore}` : 'Pathao check passed',
          rawData: data,
        }, orderId);
      }
    } catch (e) {
      console.warn('Pathao check skipped or failed:', e);
    }
  }

  // 4. Default Validation & Struct Check
  const isValidBDPhone = /^01[3-9]\d{8}$/.test(cleanPhone);
  if (!isValidBDPhone) {
    return saveAndReturn(cleanPhone, {
      status: 'HIGH',
      riskScore: 95,
      provider: 'Phone Validator',
      reason: `Invalid BD phone number format (${cleanPhone})`,
    }, orderId);
  }

  const defaultStatus: FraudRiskLevel = cancelledCount === 1 ? 'MEDIUM' : 'LOW';
  const defaultReason = cancelledCount === 1 ? 'Customer has 1 previously cancelled order' : 'New customer with valid phone number';

  return saveAndReturn(cleanPhone, {
    status: defaultStatus,
    riskScore: cancelledCount === 1 ? 45 : 10,
    provider: 'Promilaa Intelligence Guard',
    reason: defaultReason,
  }, orderId);
}

async function saveAndReturn(phone: string, result: FraudCheckResult, orderId?: string): Promise<FraudCheckResult> {
  try {
    await prisma.fraudReport.create({
      data: {
        phone,
        orderId: orderId || null,
        riskScore: result.riskScore,
        riskLevel: result.status,
        provider: result.provider,
        reason: result.reason || 'Normal check',
        rawData: result.rawData || {},
      },
    });
  } catch (err) {
    console.error('Failed to save FraudReport to DB:', err);
  }
  return result;
}
