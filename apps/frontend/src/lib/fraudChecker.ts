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
 * Directly integrated with Official FraudBD API (https://fraudbd.com/api-documentation)
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

  // 2. Official FraudBD API Integration (https://fraudbd.com/api-documentation)
  const fraudApiKey = process.env.FRAUD_API_KEY || "6f5a0bfcc142b07190191e2bc8b97c53c24e8f3a6ad0ed8ea1a33b7c400163e4";

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

          // Pathao specific rating check if available
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
      console.warn('FraudBD API request error:', e);
    }
  }

  // 3. Phone Format Validation Fallback
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
