import { AppointmentStatus } from "@prisma/client";

export function appointmentStatusTemplate({
  patientName,
  doctorName,
  message,
  date,
  status,
  pdfUrl,
}: {
  patientName: string;
  doctorName: string;
  message: string;
  date: Date;
   status: AppointmentStatus;
  pdfUrl: string;
}) {
  const statusConfig = {
    CONFIRMED: {
      color: "#10b981",
      title: "Appointment Confirmed",
    },
    CANCELLED: {
      color: "#ef4444",
      title: "Appointment Cancelled",
    },
    PENDING: {
      color: "#f59e0b",
      title: "Appointment Status Updated",
    },
  }[status];

  return `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:30px">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;overflow:hidden">

      <!-- Header -->
      <div style="background:${statusConfig.color};padding:22px;color:white;text-align:center">
        <h2 style="margin:0">${statusConfig.title}</h2>
      </div>

      <!-- Body -->
      <div style="padding:24px;color:#333">
        <p style="font-size:15px">
          Hi <strong>${patientName}</strong>,
        </p>

        <p style="margin-top:10px;font-size:14px;line-height:1.6">
          ${message}
        </p>

        <table style="width:100%;margin-top:20px;border-collapse:collapse">
          <tr>
            <td style="padding:6px 0"><strong>Doctor</strong></td>
            <td style="padding:6px 0">${doctorName}</td>
          </tr>
          <tr>
            <td style="padding:6px 0"><strong>Date & Time</strong></td>
            <td style="padding:6px 0">${new Date(date).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:6px 0"><strong>Status</strong></td>
            <td style="padding:6px 0;color:${statusConfig.color};font-weight:bold">
              ${status}
            </td>
          </tr>
        </table>

        <!-- PDF Button -->
        <a href="${pdfUrl}"
           style="
            display:inline-block;
            margin-top:22px;
            background:${statusConfig.color};
            color:white;
            padding:12px 18px;
            text-decoration:none;
            border-radius:6px;
            font-size:14px;
            font-weight:600;
           ">
          📄 View Appointment PDF
        </a>

        <p style="margin-top:28px;font-size:13px;color:#666">
          Please keep this email for your records.  
          Contact support if you need any help.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f0fdf4;text-align:center;padding:12px;font-size:12px;color:#555">
        © ${new Date().getFullYear()} LifeSpring Clinic · All rights reserved
      </div>

    </div>
  </div>
  `;
}
