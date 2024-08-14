import { createTransport } from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const sendEmail = async (to, subject, templateName, templateVars) => {
  const templatePath = path.join(
    __dirname,
    "../static/emailTemplate/",
    `${templateName}.html`
  );
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  // Replace template variables
  for (const [key, value] of Object.entries(templateVars)) {
    const placeholder = `{{${key}}}`;
    htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, "g"), value);
  }

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "pce.attendance@gmail.com",
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    // from: '"Purnea College Of Engineering" <pce.attendance@gmail.com>',
    from: "pce.attendance@gmail.com",
    to,
    subject,
    html: htmlTemplate,
  });
};
