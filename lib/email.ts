import nodemailer from "nodemailer";
import { appointmentConfirmationTemplate } from "./templates/appointmentConfirmationTemplate";
import { appointmentStatusTemplate } from "./templates/appointmentStatusTemplate";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string
) {
const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"LifeSpring" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your LifeSpring account",
    html: `
      <div style="background-color:#f6faf3;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);overflow:hidden;">

          <!-- HEADER -->
          <div style="background:#4ca626;padding:24px;text-align:center;">
            <img 
              src="${process.env.NEXT_PUBLIC_APP_URL}/images/logo2.png"
              alt="LifeSpring"
              width="56"
              style="display:block;margin:0 auto 10px;"
            />
            <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:600;">
              Welcome to LifeSpring
            </h1>
          </div>

          <!-- BODY -->
          <div style="padding:32px;color:#334155;text-align:center;">
            <p style="font-size:16px;line-height:1.6;margin-bottom:20px;">
              Thanks for signing up! Please confirm your email address to activate your account.
            </p>

            <a
              href="${verifyUrl}"
              style="
                display:inline-block;
                background:#4ca626;
                color:#ffffff;
                padding:14px 28px;
                border-radius:10px;
                text-decoration:none;
                font-weight:600;
                font-size:16px;
                margin-bottom:24px;
              "
            >
              Verify Email
            </a>

            <p style="font-size:14px;color:#64748b;line-height:1.6;">
              This verification link will expire in <strong>24 hours</strong>.
            </p>

            <p style="font-size:14px;color:#64748b;margin-top:16px;">
              If you didn’t create this account, you can safely ignore this email.
            </p>
          </div>

          <!-- FOOTER -->
          <div style="background:#f1f5f9;padding:20px;text-align:center;">
            <p style="font-size:12px;color:#94a3b8;margin:0;">
              © ${new Date().getFullYear()} LifeSpring. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `,
  });
}

export async function sendAppointmentConfirmationEmail({
  to,
  patientName,
  doctorName,
  date,
  pdfUrl,
}: {
  to: string;
  patientName: string;
  doctorName: string;
  date: Date;
  pdfUrl: string;
}) {
  await transporter.sendMail({
    from: `"HealthCare" <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ Appointment Confirmed",
    html: appointmentConfirmationTemplate({
      patientName,
      doctorName,
      date,
      pdfUrl,
    }),
  });
}


export async function sendAppointmentStatusEmail({
  to,
  patientName,
  doctorName,
  status,
  date,
  pdfUrl,
}: {
  to: string;
  patientName: string;
  doctorName: string;
  status: "APPROVED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  date: Date;
  pdfUrl: string;
}) {
  let subject = "Appointment Update";
  let message = "";

  switch (status) {
    case "APPROVED":
      subject = "✅ Appointment Approved";
      message =
        "Good news! Your appointment has been approved. Please find the details below.";
      break;

    case "CANCELLED":
      subject = "❌ Appointment Cancelled";
      message =
        "We’re sorry to inform you that your appointment has been cancelled.";
      break;

    case "RESCHEDULED":
      subject = "🔁 Appointment Rescheduled";
      message =
        "Your appointment has been rescheduled. Please review the updated date and time.";
      break;

    case "COMPLETED":
      subject = "✔ Appointment Completed";
      message =
        "Your appointment has been successfully completed. Thank you for choosing our service.";
      break;
  }

  await transporter.sendMail({
    from: `"HealthCare" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: appointmentStatusTemplate({
      patientName,
      doctorName,
      message,
      date,
      status,
      pdfUrl, // ✅ IMPORTANT: pass it here
    }),
  });
}
