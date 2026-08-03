import { FraudProvider, FraudCheckResult } from './fraud/provider.interface';
import { SteadfastProvider } from './fraud/providers/steadfast.provider';
import { PathaoProvider } from './fraud/providers/pathao.provider';
import { RedxProvider } from './fraud/providers/redx.provider';
import { PaperflyProvider } from './fraud/providers/paperfly.provider';
import { CarrybeeProvider } from './fraud/providers/carrybee.provider';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The Decision Engine maintains a priority list of providers
const providers: FraudProvider[] = [
  new SteadfastProvider(),
  new PathaoProvider(),
  new RedxProvider(),
  new PaperflyProvider(),
  new CarrybeeProvider(),
];

export const checkPhoneNumberFraud = async (phoneNumber: string, orderId?: string): Promise<FraudCheckResult> => {
  let result: FraudCheckResult = {
    status: 'UNKNOWN',
    riskScore: 0,
    provider: 'None',
    reason: 'All providers failed or not configured'
  };

  let usedProvider = 'None';
  let rawData = null;

  for (const provider of providers) {
    try {
      // Try to check with the current provider
      result = await provider.checkPhone(phoneNumber);
      usedProvider = provider.name;
      rawData = result.rawData;
      
      // If we got a valid response (not throwing), we stop trying next providers
      break;
    } catch (error: any) {
      console.warn(`Provider ${provider.name} failed. Reason: ${error.message}. Trying next...`);
      // Continue to the next provider
    }
  }

  // Save the result to the FraudReport table in DB asynchronously
  try {
    await prisma.fraudReport.create({
      data: {
        phone: phoneNumber,
        riskScore: result.riskScore,
        riskLevel: result.status,
        provider: result.provider,
        reason: result.reason,
        rawData: result.rawData || {},
        orderId: orderId, // Link to order if available
      }
    });
  } catch (dbError) {
    console.error('Failed to save FraudReport to database:', dbError);
  }

  return result;
};
