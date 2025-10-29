import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { rateLimit } from "@/lib/rate-limit";
import { createClient as createServerClient } from "@/lib/supabase/server";

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per minute
});

export async function POST(req: Request) {
  try {
    await limiter.check(req, 1, "NEWSLETTER_TOKEN"); // 1 request per minute

    const { email } = await req.json();

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    console.log("Newsletter signup request for:", email);

    // Check for duplicate subscription
    const supabase = await createServerClient();

    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" - any other error is a problem
      console.error("Error checking for duplicate:", checkError);
      return NextResponse.json(
        { error: "Error checking subscription status" },
        { status: 500 },
      );
    }

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 },
      );
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
        status: "active",
      });

    if (insertError) {
      console.error("Error inserting subscriber:", insertError);
      return NextResponse.json(
        { error: "Error subscribing to newsletter" },
        { status: 500 },
      );
    }

    // Send welcome email
    const welcomeMsg = {
      to: email,
      from: process.env.SENDER_EMAIL as string,
      subject: "Welcome to SSI Automations Newsletter!",
      text: `Thank you for subscribing to the SSI Automations newsletter!

We're excited to have you join our community of AI learning enthusiasts.

What to expect:
- Curated AI learning resources and course recommendations
- Platform updates and new features
- Learning tips and best practices
- Community highlights and success stories

You'll receive our newsletter regularly with valuable insights to help you on your AI learning journey.

If you ever wish to unsubscribe, you can do so at any time.

Best regards,
SSI Automations Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Welcome to SSI Automations Newsletter!
          </h1>

          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            Thank you for subscribing to the SSI Automations newsletter!
          </p>

          <p style="font-size: 16px; color: #555; line-height: 1.6;">
            We're excited to have you join our community of AI learning enthusiasts.
          </p>

          <h2 style="color: #333; margin-top: 30px;">What to expect:</h2>

          <ul style="font-size: 15px; color: #555; line-height: 1.8;">
            <li><strong>Curated AI learning resources</strong> and course recommendations</li>
            <li><strong>Platform updates</strong> and new features</li>
            <li><strong>Learning tips</strong> and best practices</li>
            <li><strong>Community highlights</strong> and success stories</li>
          </ul>

          <p style="font-size: 16px; color: #555; line-height: 1.6; margin-top: 30px;">
            You'll receive our newsletter regularly with valuable insights to help you on your AI learning journey.
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 13px; color: #888;">
            <p>If you ever wish to unsubscribe, you can do so at any time.</p>
            <p style="margin-top: 10px;">
              <strong>SSI Automations Team</strong><br>
              AI Learning Solutions & Automation Services
            </p>
          </div>
        </div>
      `,
    };

    console.log("Sending welcome email to:", email);

    const result = await sgMail.send(welcomeMsg);
    console.log("SendGrid response:", result);

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter!",
        email: email.toLowerCase(),
      },
      { status: 200 },
    );
  } catch (error) {
    if ((error as Error).message === "Rate limit exceeded") {
      return NextResponse.json(
        {
          error:
            "Too many subscription attempts. Please try again in a minute.",
        },
        { status: 429 },
      );
    }
    console.error("Detailed error in newsletter signup:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Error processing newsletter subscription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
