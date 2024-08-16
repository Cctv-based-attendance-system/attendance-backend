import { createTransport } from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const sendEmail = async (to, subject, templateName, templateVars) => {
  try {
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
        user: "rajeevraaz2pz@gmail.com",
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    console.log(to, subject);
    await transporter.sendMail({
      // from: '"Purnea College Of Engineering" <rajeevraaz2pz@gmail.com>',
      from: "rajeevraaz2pz@gmail.com",
      to,
      subject,
      html: htmlTemplate,
    });
  } catch (e) {
    console.log(e);
  }
};
