import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import nodemailer from "nodemailer";

interface UserDetail {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: UserDetail) => {
  try {
    //TODO: configure mail for usage

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    const verifyHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}}">here</a>
    to verify your email or copy and paste the link below in your browser
    <br>
    ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
    </p>`;

    const resetHTML = `<p>Click <a href="${process.env.DOMAIN}/resetPassword?token=${hashedToken}}">here</a>
    to reset your password or copy and paste the link below in your browser
    <br>
    ${process.env.DOMAIN}/resetPassword?token=${hashedToken}
    </p>`;

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ef5b7a0dd8993c",
        pass: "0938eab2204e60",
      },
    });

    const mailOptions = {
      from: "hamza@ai.com", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: emailType === "VERIFY" ? verifyHTML : resetHTML,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
