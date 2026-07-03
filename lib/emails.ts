import path from "node:path";
import pug from "pug";

const templatesDir = path.join(process.cwd(), "lib/emails");
const compiled = new Map<string, pug.compileTemplate>();

function render(templateName: string, locals: Record<string, unknown>) {
  let fn = compiled.get(templateName);
  if (!fn) {
    fn = pug.compileFile(path.join(templatesDir, templateName));
    compiled.set(templateName, fn);
  }
  return fn(locals);
}

export function renderVerificationEmail(verifyUrl: string) {
  return render("verification.pug", {
    subject: "Confirm your email address",
    verifyUrl,
  });
}

export function renderPasswordResetEmail(resetUrl: string) {
  return render("password-reset.pug", {
    subject: "Reset your password",
    resetUrl,
  });
}
