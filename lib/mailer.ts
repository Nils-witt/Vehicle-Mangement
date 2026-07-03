import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/verify-email?token=${token}`;

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? "no-reply@kfz-verwaltung.local",
    to: email,
    subject: "Confirm your email address",
    text: `Welcome to KFZ-Verwaltung!\n\nPlease confirm your email address by visiting the link below:\n${verifyUrl}\n\nThis link expires in 24 hours. If you did not create an account, you can ignore this email.`,
    html: `<p>Welcome to KFZ-Verwaltung!</p><p>Please confirm your email address by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? "no-reply@kfz-verwaltung.local",
    to: email,
    subject: "Reset your password",
    text: `We received a request to reset your password.\n\nVisit the link below to choose a new password:\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, you can ignore this email — your password will not change.`,
    html: `<p>We received a request to reset your password.</p><p>Click the link below to choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email — your password will not change.</p>`,
  });
}
