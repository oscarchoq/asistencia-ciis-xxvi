"use server";

import { sendMail, SendMailParams } from "@/config/nodemailer";

export async function sendEmail({
  to, name, subject
}: SendMailParams) {
  try {
    const info = await sendMail({ to, name, subject })
    return { info }
  } catch (error) {
    console.log(error)
  }
}