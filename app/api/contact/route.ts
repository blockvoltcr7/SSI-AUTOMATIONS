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
    const { 
      firstName,
      lastName,
      email, 
      phone, 
      company,
      webUrl,
      serviceInterest,
      timeline,
      message,
      transactionalConsent,
      marketingConsent
    } = await req.json();

    console.log("Received form data:", { 
      firstName,
      lastName,
      email, 
      phone, 
      company,
      webUrl,
      serviceInterest,
      timeline,
      message,
      transactionalConsent,
      marketingConsent
    });

    const webUrlFormatted = webUrl ? webUrl.replace(/https?:\/\//i, '[https]://').replace(/\./g, '[.]') : 'Not provided';

    const msg = {
      to: process.env.ADMIN_EMAIL_ADDRESS as string,
      from: process.env.FROM_EMAIL_ADDRESS as string,
      subject: "New Contact Form Submission",
      text: `Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Company: ${company}
Website URL: ${webUrlFormatted}
Service Interest: ${serviceInterest || 'Not provided'}
Timeline: ${timeline || 'Not provided'}
Message: ${message}

Consent Information:
- Transactional Messages: ${transactionalConsent ? 'Yes' : 'No'}
- Marketing Messages: ${marketingConsent ? 'Yes' : 'No'}`,
      html: `<p><strong>Name:</strong> ${firstName} ${lastName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Company:</strong> ${company}</p>
             <p><strong>Website URL:</strong> <span style="font-family:monospace;">${webUrlFormatted}</span></p>
             <p><strong>Service Interest:</strong> ${serviceInterest || 'Not provided'}</p>
             <p><strong>Timeline:</strong> ${timeline || 'Not provided'}</p>
             <p><strong>Message:</strong> ${message}</p>
             <br>
             <p><strong>Consent Information:</strong></p>
             <ul>
               <li>Transactional Messages: ${transactionalConsent ? '✓ Yes' : '✗ No'}</li>
               <li>Marketing Messages: ${marketingConsent ? '✓ Yes' : '✗ No'}</li>
             </ul>`,
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
