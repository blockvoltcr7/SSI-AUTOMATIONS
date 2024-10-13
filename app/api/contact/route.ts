import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { rateLimit } from "@/lib/rate-limit";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

export async function POST(req: Request) {
  try {
    await limiter.check(req, 3, "CACHE_TOKEN"); // 3 requests per minute
    const { name, email, company, message } = await req.json();

    console.log("Received form data:", { name, email, company, message });

    const msg = {
      to: process.env.RECIPIENT_EMAIL as string,
      from: process.env.SENDER_EMAIL as string,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    console.log("Preparing to send email with data:", msg);

    const result = await sgMail.send(msg);
    console.log("SendGrid API response:", result);

    return NextResponse.json(
      { message: "Email sent successfully", sendGridResponse: result },
      { status: 200 }
    );
  } catch (error) {
    if ((error as Error).message === "Rate limit exceeded") {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    console.error("Detailed error in sending email:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Error sending email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
