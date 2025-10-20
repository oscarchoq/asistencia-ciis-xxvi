
// import { inscriptionEmailTemplate } from '@/templates/mail.inscription';
import nodemailer from 'nodemailer'

const host = process.env.EMAIL_HOST || '';
const port = parseInt(process.env.EMAIL_PORT || '465', 10);
const email = process.env.EMAIL_USER || '';
const password = process.env.EMAIL_PASS || '';

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: email,
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

export interface SendMailParams {
  to: string,
  name: string,
  subject: string,
}

// function getRegistrationEmailHtml(name: string): string {
//   return inscriptionEmailTemplate.replace("{{name}}", name);
// }


export async function sendMail({to, name, subject}: SendMailParams) {

  // const htmlContent = getRegistrationEmailHtml(name);

  const htmlContent = `<p>Hola ${name}, este es un correo de prueba.</p>`;

  const mailOptions = {
    from: `"CIIS Tacna" <${email}>`,
    to,
    subject,
    html: htmlContent,
  };
  return await transporter.sendMail(mailOptions);
}
