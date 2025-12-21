import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"TechSolutionsUtrecht" <noreply@techsolutionsutrecht.nl>',
            to,
            subject,
            text,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email error:", error);
        return { success: false, error };
    }
}
