import { resend } from "@/lib/resend.js";

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink =
    `${process.env.APP_URL}` + `/api/v1/auth/verify-email` + `?token=${token}`;

  const response = await resend.emails.send({
    from: "CollabCode <onboarding@resend.dev>",

    to: email,

    subject: "Verify your email",

    html: `
      <h2>Verify your email</h2>

      <p>
        Click below to verify your account
      </p>

      <a href="${verificationLink}">
        Verify Email
      </a>
    `,
  });
  console.log("Email sent:", response);
};
