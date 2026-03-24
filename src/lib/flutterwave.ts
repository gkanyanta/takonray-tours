const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";

interface PaymentInitParams {
  amount: number;
  currency: string;
  email: string;
  name: string;
  phone?: string;
  bookingRef: string;
  redirectUrl: string;
  paymentMethod?: string; // "card", "mobilemoneyzambia", "mobilemoneyghana", etc.
}

interface FlutterwaveResponse {
  status: string;
  message: string;
  data: {
    link: string;
    [key: string]: any;
  };
}

export async function initializePayment(
  params: PaymentInitParams
): Promise<FlutterwaveResponse> {
  const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: params.bookingRef,
      amount: params.amount,
      currency: params.currency,
      redirect_url: params.redirectUrl,
      customer: {
        email: params.email,
        name: params.name,
        phonenumber: params.phone,
      },
      customizations: {
        title: "Takonray Tours",
        description: `Payment for booking ${params.bookingRef}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
      },
      payment_options: params.paymentMethod,
    }),
  });

  return response.json();
}

export async function verifyPayment(transactionId: string) {
  const response = await fetch(
    `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    }
  );
  return response.json();
}

export function verifyWebhookSignature(
  signature: string,
  secret: string
): boolean {
  return signature === secret;
}
