const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function getPhoneNumberId() {
  return process.env.WHATSAPP_PHONE_NUMBER_ID!;
}

// ---------------------------------------------------------------------------
// Send a free-form text message (only within 24h customer-service window)
// ---------------------------------------------------------------------------

export async function sendTextMessage(to: string, body: string) {
  const response = await fetch(
    `${WHATSAPP_API_URL}/${getPhoneNumberId()}/messages`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  return response.json();
}

// ---------------------------------------------------------------------------
// Send a pre-approved template message
// ---------------------------------------------------------------------------

interface TemplateParameter {
  type: "text" | "currency" | "date_time";
  text?: string;
  currency?: { fallback_value: string; code: string; amount_1000: number };
  date_time?: { fallback_value: string };
}

interface TemplateComponent {
  type: "header" | "body" | "button";
  sub_type?: string;
  index?: number;
  parameters: TemplateParameter[];
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "en",
  components: TemplateComponent[] = []
) {
  const response = await fetch(
    `${WHATSAPP_API_URL}/${getPhoneNumberId()}/messages`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      }),
    }
  );

  return response.json();
}

// ---------------------------------------------------------------------------
// Convenience helpers for common messages
// ---------------------------------------------------------------------------

export async function sendBookingConfirmation(
  to: string,
  params: {
    customerName: string;
    bookingRef: string;
    tourName: string;
    date: string;
    amount: string;
  }
) {
  return sendTemplateMessage("booking_confirmation", to, "en", [
    {
      type: "body",
      parameters: [
        { type: "text", text: params.customerName },
        { type: "text", text: params.bookingRef },
        { type: "text", text: params.tourName },
        { type: "text", text: params.date },
        { type: "text", text: params.amount },
      ],
    },
  ]);
}

export async function sendPaymentReminder(
  to: string,
  params: {
    customerName: string;
    bookingRef: string;
    amount: string;
    dueDate: string;
  }
) {
  return sendTemplateMessage("payment_reminder", to, "en", [
    {
      type: "body",
      parameters: [
        { type: "text", text: params.customerName },
        { type: "text", text: params.bookingRef },
        { type: "text", text: params.amount },
        { type: "text", text: params.dueDate },
      ],
    },
  ]);
}
