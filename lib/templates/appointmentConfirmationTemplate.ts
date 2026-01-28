export function appointmentConfirmationTemplate({
  patientName,
  doctorName,
  date,
  pdfUrl,
}: {
  patientName: string;
  doctorName: string;
  date: Date;
  pdfUrl: string;
}) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:30px">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px">
      
      <div style="background:#10b981;padding:20px;color:white;text-align:center">
        <h2>Appointment Bookes</h2>
      </div>

      <div style="padding:24px;color:#333">
        <p>Hi <strong>${patientName}</strong>,</p>

        <p>Your appointment has been successfully confirmed.</p>

        <table style="width:100%;margin:20px 0">
          <tr>
            <td><strong>Doctor:</strong></td>
            <td>${doctorName}</td>
          </tr>
          <tr>
            <td><strong>Date & Time:</strong></td>
            <td>${new Date(date).toLocaleString()}</td>
          </tr>
        </table>

        <a href="${pdfUrl}"
           style="display:inline-block;margin-top:20px;
           background:#10b981;color:white;padding:12px 18px;
           text-decoration:none;border-radius:6px">
          📄 View Appointment PDF
        </a>

        <p style="margin-top:30px;font-size:13px;color:#666">
          Please keep this email for your records.
        </p>
      </div>

      <div style="background:#f0fdf4;text-align:center;padding:12px;font-size:12px">
        © ${new Date().getFullYear()} HealthCare System
      </div>
    </div>
  </div>
  `;
}
