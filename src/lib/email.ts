import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_placeholder");
}

const FROM_EMAIL = "Takonray Tours <bookings@takonraytours.com>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------

function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: #0f766e; color: #ffffff; padding: 24px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .body { padding: 32px; color: #18181b; line-height: 1.6; }
    .footer { padding: 24px 32px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; }
    .btn { display: inline-block; background: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f4f4f5; }
    .detail-label { font-weight: 600; color: #52525b; }
    table.details { width: 100%; border-collapse: collapse; }
    table.details td { padding: 8px 0; border-bottom: 1px solid #f4f4f5; }
    table.details td:first-child { font-weight: 600; color: #52525b; width: 40%; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Takonray Tours</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>Takonray Tours &bull; Livingstone, Zambia</p>
      <p>Questions? Reply to this email or WhatsApp us at +260 XXX XXXXXX</p>
    </div>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Booking Confirmation
// ---------------------------------------------------------------------------

interface BookingConfirmationParams {
  customerName: string;
  bookingRef: string;
  tourName: string;
  date: string;
  guests: number;
  totalAmount: string;
  depositAmount: string;
  paymentUrl?: string;
}

export async function sendBookingConfirmation(
  to: string,
  params: BookingConfirmationParams
) {
  const content = `
    <h2>Booking Confirmed!</h2>
    <p>Hi ${params.customerName},</p>
    <p>Thank you for booking with Takonray Tours. Here are your booking details:</p>

    <table class="details">
      <tr><td>Booking Reference</td><td><strong>${params.bookingRef}</strong></td></tr>
      <tr><td>Experience</td><td>${params.tourName}</td></tr>
      <tr><td>Date</td><td>${params.date}</td></tr>
      <tr><td>Guests</td><td>${params.guests}</td></tr>
      <tr><td>Total Amount</td><td>${params.totalAmount}</td></tr>
      <tr><td>Deposit Due</td><td>${params.depositAmount}</td></tr>
    </table>

    ${
      params.paymentUrl
        ? `<p style="text-align:center; margin-top:24px;">
            <a class="btn" href="${params.paymentUrl}">Pay Deposit Now</a>
          </p>`
        : ""
    }

    <p>We look forward to welcoming you in Livingstone!</p>
  `;

  return sendEmail({
    to,
    subject: `Booking Confirmed - ${params.bookingRef}`,
    html: baseLayout(content),
  });
}

// ---------------------------------------------------------------------------
// Payment Receipt
// ---------------------------------------------------------------------------

interface PaymentReceiptParams {
  customerName: string;
  bookingRef: string;
  amountPaid: string;
  paymentMethod: string;
  transactionId: string;
  date: string;
  remainingBalance?: string;
}

export async function sendPaymentReceipt(
  to: string,
  params: PaymentReceiptParams
) {
  const content = `
    <h2>Payment Received</h2>
    <p>Hi ${params.customerName},</p>
    <p>We have received your payment. Here is your receipt:</p>

    <table class="details">
      <tr><td>Booking Reference</td><td><strong>${params.bookingRef}</strong></td></tr>
      <tr><td>Amount Paid</td><td>${params.amountPaid}</td></tr>
      <tr><td>Payment Method</td><td>${params.paymentMethod}</td></tr>
      <tr><td>Transaction ID</td><td>${params.transactionId}</td></tr>
      <tr><td>Date</td><td>${params.date}</td></tr>
      ${params.remainingBalance ? `<tr><td>Remaining Balance</td><td>${params.remainingBalance}</td></tr>` : ""}
    </table>

    <p>Thank you for your payment!</p>
  `;

  return sendEmail({
    to,
    subject: `Payment Receipt - ${params.bookingRef}`,
    html: baseLayout(content),
  });
}

// ---------------------------------------------------------------------------
// Booking Cancellation
// ---------------------------------------------------------------------------

interface BookingCancellationParams {
  customerName: string;
  bookingRef: string;
  tourName: string;
  date: string;
  refundAmount?: string;
  reason?: string;
}

export async function sendBookingCancellation(
  to: string,
  params: BookingCancellationParams
) {
  const content = `
    <h2>Booking Cancelled</h2>
    <p>Hi ${params.customerName},</p>
    <p>Your booking has been cancelled. Here are the details:</p>

    <table class="details">
      <tr><td>Booking Reference</td><td><strong>${params.bookingRef}</strong></td></tr>
      <tr><td>Experience</td><td>${params.tourName}</td></tr>
      <tr><td>Original Date</td><td>${params.date}</td></tr>
      ${params.refundAmount ? `<tr><td>Refund Amount</td><td>${params.refundAmount}</td></tr>` : ""}
      ${params.reason ? `<tr><td>Reason</td><td>${params.reason}</td></tr>` : ""}
    </table>

    ${params.refundAmount ? "<p>Your refund will be processed within 5-10 business days.</p>" : ""}

    <p>If you have any questions, please don't hesitate to reach out.</p>
  `;

  return sendEmail({
    to,
    subject: `Booking Cancelled - ${params.bookingRef}`,
    html: baseLayout(content),
  });
}
