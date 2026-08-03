# FRAUD_DETECTION.md — Promilaa

## 1. Overview
E-commerce in Bangladesh (especially Cash on Delivery) faces a high rate of fake orders. To mitigate this, Promilaa will integrate with **Fraud BD** (fraudbd.com) during the order placement flow.

## 2. Integration Point
The fraud check will happen in the **Backend Orders API** (`POST /api/orders`).
It will occur **after** basic validation but **before** saving the order to the database.

## 3. Workflow
1. **Order Submission:** User submits checkout form (Guest or Logged In) with their phone number.
2. **Fraud Check:** The backend sends the `guestPhone` (or user's saved phone) to the Fraud BD API.
3. **Response Handling:**
   - **Safe/Green:** Proceed with order creation normally (`OrderStatus.PENDING`).
   - **Suspicious/Yellow:** Create the order but flag it internally for admin review. The Admin Panel will show a warning badge next to this order.
   - **High Risk/Red:** Block the order creation entirely, returning a polite error message to the customer ("We are unable to process this order. Please contact support.").

## 4. Implementation Details (Backend)
- We will create a `FraudService` utility in the backend (`apps/backend/src/services/fraud.service.ts`).
- **Endpoint:** `POST https://fraudbd.com/api/check-courier-info`
- **Headers:** `Content-Type: application/json` and `api_key: <FRAUD_API_KEY>`
- **Payload:** `{ "phone_number": "017XXXXXXXX" }`
- **Environment Variables:** The API Key will be stored in `.env` as `FRAUD_API_KEY`.

## 5. Relation to Auth
- This applies to **all orders**, especially **Guest Orders** (checkout without login).
- The authentication system (Milestone 3) is strictly optional for customers. Guest checkout remains fully enabled.
