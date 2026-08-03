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
 * Robust Multi-Tiered Fallback Fraud Checking Engine for BD E-Commerce
 * 
 * Execution Flow:
 * Tier 1: FraudBD Multi-Courier API (Primary Guard - checks Pathao, Steadfast, RedX, Paperfly)
 * Tier 2: Steadfast Courier Direct API (Fallback 1)
 * Tier 3: Pathao Courier Direct API (Fallback 2)
 * Tier 4: RedX / Carrybee Direct API (Fallback 3)
 * Tier 5: Promilaa Internal DB Order History & Phone Format Guard (Safeguard)
 */
export async function checkPhoneNumberFraud(phone: string, orderId?: string): Promise<FraudCheckResult> {
  const cleanPhone = phone.trim();

  // 1. Internal Order History Check (Previous returned/cancelled orders in Promilaa DB)
  const previousOrders = await prisma.order.findMany({
    where: { guestPhone: cleanPhone },
    select: { status: true },
  });

  const cancelledCount = previousOrders.filter(o => o.status === 'CANCELLED' || o.status === 'RETURNED').length;

  if (cancelledCount >= 2) {
    return saveAndReturn(cleanPhone, {
      status: 'HIGH',
      riskScore: 90,
      provider: 'Promilaa Internal Database Guard',
      reason: `Customer has ${cancelledCount} previously cancelled/returned orders in Promilaa DB! High Risk!`,
      rawData: { cancelledCount },
    }, orderId);
  }

  // Tier 1: Official FraudBD Multi-Courier API (https://fraudbd.com/api-documentation)
  const fraudApiKey = process.env.FRAUD_API_KEY;

  if (fraudApiKey) {
    try {
      const res = await fetch('https://fraudbd.com/api/check-courier-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api_key': fraudApiKey,
        },
        body: JSON.stringify({ phone_number: cleanPhone }),
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const json = await res.json();

        if (json.status && json.data) {
          const totalSummary = json.data.totalSummary || {};
          const summaries = json.data.Summaries || {};

          const total = totalSummary.total || 0;
          const success = totalSummary.success || 0;
          const cancel = totalSummary.cancel || 0;
          const successRate = totalSummary.successRate ?? (total > 0 ? (success / total) * 100 : 100);

          const pathaoRisk = summaries.Pathao?.risk_level;

          let riskScore = 10;
          let status: FraudRiskLevel = 'LOW';

          if (cancel >= 3 || successRate < 50 || pathaoRisk === 'high' || pathaoRisk === 'very_high') {
            riskScore = 85;
            status = 'HIGH';
          } else if (cancel >= 1 || successRate < 75 || pathaoRisk === 'medium') {
            riskScore = 50;
            status = 'MEDIUM';
          }

          const reason = total > 0
            ? `FraudBD (Pathao, Steadfast, Redx, Paperfly): ${success}/${total} Delivered (${successRate.toFixed(1)}% success rate, ${cancel} cancelled)`
            : 'FraudBD: Clean Courier History (No recorded cancellations)';

          return saveAndReturn(cleanPhone, {
            status,
            riskScore,
            provider: 'FraudBD Multi-Courier Guard',
            reason,
            rawData: json.data,
          }, orderId);
        }
      }
    } catch (e) {
      console.warn('[Fraud Engine] Tier 1 FraudBD check skipped or unavailable, triggering Tier 2 Fallback:', e);
    }
  }

  // Tier 2: Steadfast Courier Direct API Fallback
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
          provider: 'Steadfast Courier Direct',
          reason: riskScore > 30 ? `Steadfast reported risk score of ${riskScore}` : 'Steadfast check passed',
          rawData: data,
        }, orderId);
      }
    } catch (e) {
      console.warn('[Fraud Engine] Tier 2 Steadfast check skipped or unavailable, triggering Tier 3 Fallback:', e);
    }
  }

  // Tier 3: Pathao Courier Direct API Fallback
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
          provider: 'Pathao Courier Direct',
          reason: riskScore > 30 ? `Pathao reported risk score of ${riskScore}` : 'Pathao check passed',
          rawData: data,
        }, orderId);
      }
    } catch (e) {
      console.warn('[Fraud Engine] Tier 3 Pathao check skipped or unavailable, triggering Tier 4 Fallback:', e);
    }
  }

  // Tier 4: RedX / Carrybee Direct API Fallback
  const redxPhone = process.env.REDX_PHONE;
  const redxPassword = process.env.REDX_PASSWORD;

  if (redxPhone && redxPassword) {
    try {
      const res = await fetch('https://api.redx.com.bd/v1/parcels/fraud-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${redxPassword}`,
        },
        body: JSON.stringify({ phone: cleanPhone }),
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        const riskScore = data.risk_score || 0;
        let status: FraudRiskLevel = 'LOW';
        if (riskScore > 70) status = 'HIGH';
        else if (riskScore > 30) status = 'MEDIUM';

        return saveAndReturn(cleanPhone, {
          status,
          riskScore,
          provider: 'RedX Courier Direct',
          reason: `RedX reported risk score of ${riskScore}`,
          rawData: data,
        }, orderId);
      }
    } catch (e) {
      console.warn('[Fraud Engine] Tier 4 RedX check skipped or unavailable:', e);
    }
  }

  // Tier 5: Phone Format Validation & Promilaa DB Safeguard
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
