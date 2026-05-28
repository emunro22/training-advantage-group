import { Resend } from "resend";
import type { BookingFormData, ContactFormData } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Training Advantage Group <office@trainingadvantagegroup.co.uk>";
const TO = process.env.EMAIL_TO || "office@trainingadvantagegroup.co.uk";

export async function sendBookingConfirmation(data: BookingFormData) {
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d1b4b 0%, #0066cc 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Request Received</h1>
        <p style="color: #cce0ff; margin: 8px 0 0;">Training Advantage Group Ltd</p>
      </div>
      <div style="padding: 30px; background: #f4f7fa;">
        <p style="color: #333; font-size: 16px;">Dear ${data.firstName},</p>
        <p style="color: #333;">Thank you for your booking request. We have received your enquiry and will confirm your place within 24 hours.</p>

        <div style="background: white; border-radius: 8px; padding: 24px; margin: 20px 0; border-left: 4px solid #ff6600;">
          <h2 style="color: #0d1b4b; margin: 0 0 16px; font-size: 18px;">Booking Summary</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 40%;">Course:</td><td style="padding: 8px 0; color: #333; font-weight: bold;">${data.courseName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Preferred Date:</td><td style="padding: 8px 0; color: #333;">${data.preferredDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location:</td><td style="padding: 8px 0; color: #333;">${data.location}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Delegates:</td><td style="padding: 8px 0; color: #333;">${data.delegates}</td></tr>
            ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Company:</td><td style="padding: 8px 0; color: #333;">${data.company}</td></tr>` : ""}
          </table>
        </div>

        <p style="color: #333;">If you have any questions, please don't hesitate to contact us:</p>
        <ul style="color: #333; list-style: none; padding: 0;">
          <li style="padding: 4px 0;">📞 <a href="tel:01412582024" style="color: #0066cc;">0141 258 2024</a></li>
          <li style="padding: 4px 0;">✉️ <a href="mailto:office@trainingadvantagegroup.co.uk" style="color: #0066cc;">office@trainingadvantagegroup.co.uk</a></li>
        </ul>
      </div>
      <div style="background: #0d1b4b; padding: 20px; text-align: center;">
        <p style="color: #8899bb; margin: 0; font-size: 12px;">Training Advantage Group Ltd | Registered in Scotland No. SC765674</p>
        <p style="color: #8899bb; margin: 4px 0 0; font-size: 12px;">1st Floor Training Suite, APC Depot, Coalburn Road, Bothwell, G71 8DA</p>
      </div>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1b4b; padding: 20px;">
        <h2 style="color: white; margin: 0;">New Booking Request</h2>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666; width: 35%;">Name:</td><td style="padding: 10px; font-weight: bold;">${data.firstName} ${data.lastName}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Email:</td><td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Phone:</td><td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          ${data.company ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Company:</td><td style="padding: 10px;">${data.company}</td></tr>` : ""}
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Course:</td><td style="padding: 10px; font-weight: bold; color: #0066cc;">${data.courseName}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Preferred Date:</td><td style="padding: 10px;">${data.preferredDate}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Location:</td><td style="padding: 10px;">${data.location}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Delegates:</td><td style="padding: 10px;">${data.delegates}</td></tr>
          ${data.message ? `<tr><td style="padding: 10px; color: #666; vertical-align: top;">Message:</td><td style="padding: 10px;">${data.message}</td></tr>` : ""}
        </table>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [data.email],
      subject: `Booking Request Confirmed – ${data.courseName} | Training Advantage Group`,
      html: customerHtml,
    }),
    resend.emails.send({
      from: FROM,
      to: [TO],
      subject: `New Booking: ${data.courseName} – ${data.firstName} ${data.lastName}`,
      html: adminHtml,
      replyTo: data.email,
    }),
  ]);
}

export async function sendContactEmail(data: ContactFormData) {
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1b4b; padding: 20px;">
        <h2 style="color: white; margin: 0;">New Contact Enquiry</h2>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666; width: 35%;">Name:</td><td style="padding: 10px; font-weight: bold;">${data.firstName} ${data.lastName}</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Email:</td><td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.phone ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Phone:</td><td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ""}
          ${data.company ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Company:</td><td style="padding: 10px;">${data.company}</td></tr>` : ""}
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Subject:</td><td style="padding: 10px; font-weight: bold;">${data.subject}</td></tr>
          <tr><td style="padding: 10px; color: #666; vertical-align: top;">Message:</td><td style="padding: 10px;">${data.message.replace(/\n/g, "<br>")}</td></tr>
        </table>
      </div>
    </div>
  `;

  const autoReplyHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0d1b4b 0%, #0066cc 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Enquiry</h1>
        <p style="color: #cce0ff; margin: 8px 0 0;">Training Advantage Group Ltd</p>
      </div>
      <div style="padding: 30px; background: #f4f7fa;">
        <p style="color: #333;">Dear ${data.firstName},</p>
        <p style="color: #333;">Thank you for contacting Training Advantage Group. We have received your message and will respond within 1 business day.</p>
        <p style="color: #333;">For urgent enquiries please call us on <a href="tel:01412582024" style="color: #0066cc; font-weight: bold;">0141 258 2024</a>.</p>
      </div>
      <div style="background: #0d1b4b; padding: 20px; text-align: center;">
        <p style="color: #8899bb; margin: 0; font-size: 12px;">Training Advantage Group Ltd | Registered in Scotland No. SC765674</p>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: [data.email],
      subject: "We've received your enquiry | Training Advantage Group",
      html: autoReplyHtml,
    }),
    resend.emails.send({
      from: FROM,
      to: [TO],
      subject: `Enquiry: ${data.subject} – ${data.firstName} ${data.lastName}`,
      html: adminHtml,
      replyTo: data.email,
    }),
  ]);
}
