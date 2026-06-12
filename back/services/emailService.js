import nodemailer from 'nodemailer';

// Transporter reutilizable
let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    return transporter;
}

// Formatea fecha "YYYY-MM-DD" como "lunes 17 de marzo"
function formatDateStr(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
}

export async function sendBookingConfirmation({ clientName, clientEmail, serviceName, dateStr, time, endTime }) {
    if (!clientEmail) return; // Si no hay email, no mandamos nada

    const salonName = process.env.SALON_NAME || 'M&O Estilistas';
    const salonPhone = process.env.SALON_PHONE || '';
    const salonEmail = process.env.GMAIL_USER;
    const dateLabel = formatDateStr(dateStr);

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Confirmación de turno</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f43f5e,#e11d48);padding:36px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">${salonName}</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Confirmación de turno</p>
          </td>
        </tr>

        <!-- Check icon -->
        <tr>
          <td style="padding:32px 40px 0;text-align:center;">
            <div style="width:64px;height:64px;background:#dcfce7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
              <span style="font-size:32px;">✅</span>
            </div>
            <h2 style="margin:0 0 6px;color:#18181b;font-size:22px;font-weight:700;">¡Tu turno está confirmado!</h2>
            <p style="margin:0;color:#71717a;font-size:15px;">Hola <strong>${clientName}</strong>, te esperamos.</p>
          </td>
        </tr>

        <!-- Detalle del turno -->
        <tr>
          <td style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff1f2;border-radius:12px;border:1px solid #fecdd3;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #fecdd3;">
                        <span style="color:#9f1239;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Servicio</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #fecdd3;text-align:right;">
                        <span style="color:#18181b;font-size:14px;font-weight:600;">${serviceName}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #fecdd3;">
                        <span style="color:#9f1239;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Fecha</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #fecdd3;text-align:right;">
                        <span style="color:#18181b;font-size:14px;font-weight:600;text-transform:capitalize;">${dateLabel}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;">
                        <span style="color:#9f1239;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Horario</span>
                      </td>
                      <td style="padding:8px 0;text-align:right;">
                        <span style="color:#e11d48;font-size:16px;font-weight:800;">${time} → ${endTime}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Aviso de cancelación -->
        <tr>
          <td style="padding:0 40px 28px;">
            <p style="margin:0;color:#71717a;font-size:13px;text-align:center;line-height:1.6;">
              Si necesitás cancelar o reprogramar tu turno,<br/>
              contactanos por WhatsApp al <strong>${salonPhone}</strong><br/>
              o respondé este email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f4f4f5;padding:20px 40px;text-align:center;border-top:1px solid #e4e4e7;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;">
              ${salonName} · <a href="mailto:${salonEmail}" style="color:#f43f5e;text-decoration:none;">${salonEmail}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await getTransporter().sendMail({
        from: `"${salonName}" <${process.env.GMAIL_USER}>`,
        to: clientEmail,
        subject: `✅ Turno confirmado — ${serviceName} el ${dateLabel}`,
        html,
    });
}