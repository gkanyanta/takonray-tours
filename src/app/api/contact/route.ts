import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = parsed.data;

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || "info@takonraytours.com";

    await sendEmail({
      to: adminEmail,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; width: 120px;">Name</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Email</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${
            phone
              ? `<tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">Phone</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600; vertical-align: top;">Message</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <p style="margin-top: 16px; color: #666; font-size: 12px;">
          Sent from the Takonray Tours website contact form.
        </p>
      `,
    });

    // Send auto-reply to the customer
    await sendEmail({
      to: email,
      subject: "Thank you for contacting Takonray Tours",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p>If your inquiry is urgent, you can also reach us via WhatsApp or call us directly.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>Takonray Tours Team</strong></p>
        <p>Livingstone, Zambia</p>
      `,
    });

    return NextResponse.json(
      { message: "Your message has been sent successfully. We will get back to you shortly!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
