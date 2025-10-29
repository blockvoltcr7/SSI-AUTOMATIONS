import { NextResponse } from "next/server";
// import { rateLimit } from "@/lib/rate-limit"; // TODO: Re-enable rate limiting in production
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

// Create scoped logger for newsletter operations
const log = logger.scope("Newsletter");

// TODO: Re-enable rate limiting in production
// const limiter = rateLimit({
//   interval: 60 * 1000, // 1 minute
//   uniqueTokenPerInterval: 500, // Max 500 users per minute
// });

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7);
  log.info(`[${requestId}] Incoming POST request to /api/newsletter`);

  try {
    // Verify service role key is configured (server-side only check)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      log.error(
        `[${requestId}] CONFIGURATION ERROR: Missing SUPABASE_SERVICE_ROLE_KEY`,
      );
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 },
      );
    }

    // Rate limiting disabled for testing - re-enable in production
    // log.debug(`[${requestId}] Checking rate limit`);
    // await limiter.check(req, 1, "NEWSLETTER_TOKEN"); // 1 request per minute
    // log.debug(`[${requestId}] Rate limit check passed`);

    log.debug(`[${requestId}] Parsing request body`);
    const { email } = await req.json();
    log.info(`[${requestId}] Request body parsed`, {
      email: email ? "provided" : "missing",
    });

    // Validate email format
    log.debug(`[${requestId}] Validating email format`);
    if (!email || typeof email !== "string") {
      log.warn(`[${requestId}] Email validation failed: Email is required`);
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(email)) {
      log.warn(`[${requestId}] Email validation failed: Invalid format`, {
        email,
      });
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }
    log.info(`[${requestId}] Email validation passed`, { email });

    // Check for duplicate subscription
    // Use admin client since newsletter_subscribers table has RLS disabled
    log.debug(`[${requestId}] Creating Supabase admin client`);
    let supabase;
    try {
      supabase = createAdminClient();
      log.debug(`[${requestId}] Supabase admin client created successfully`);
    } catch (clientError) {
      log.error(
        `[${requestId}] Failed to create Supabase admin client`,
        clientError,
      );
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 500 },
      );
    }

    log.debug(`[${requestId}] Checking for existing subscription`, {
      email: email.toLowerCase(),
    });
    const { data: existingSubscriber, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" - any other error is a problem
      log.error(
        `[${requestId}] Database error checking for duplicate`,
        checkError,
        {
          errorCode: checkError.code,
          email: email.toLowerCase(),
        },
      );
      return NextResponse.json(
        { error: "Error checking subscription status" },
        { status: 500 },
      );
    }

    if (existingSubscriber) {
      log.warn(`[${requestId}] Duplicate subscription attempt`, {
        email: email.toLowerCase(),
      });
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 },
      );
    }
    log.info(
      `[${requestId}] No existing subscription found - proceeding with insert`,
    );

    // Insert new subscriber with welcomed=false
    // Welcome emails will be sent by scheduled job at midnight
    log.debug(`[${requestId}] Inserting new subscriber into database`);
    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: email.toLowerCase(),
        subscribed_at: new Date().toISOString(),
        status: "active",
        welcomed: false, // Will be set to true after welcome email is sent by cron job
      });

    if (insertError) {
      log.error(
        `[${requestId}] Database error inserting subscriber`,
        insertError,
        {
          email: email.toLowerCase(),
        },
      );
      return NextResponse.json(
        { error: "Error subscribing to newsletter" },
        { status: 500 },
      );
    }

    log.info(`[${requestId}] Successfully inserted subscriber into database`, {
      email: email.toLowerCase(),
      welcomed: false,
      note: "Welcome email will be sent by scheduled job",
    });

    log.info(`[${requestId}] Newsletter subscription completed successfully`, {
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      {
        message:
          "Successfully subscribed to newsletter! You'll receive a welcome email soon.",
        email: email.toLowerCase(),
      },
      { status: 200 },
    );
  } catch (error) {
    // Rate limiting disabled for testing - re-enable in production
    // if ((error as Error).message === "Rate limit exceeded") {
    //   log.warn(`[${requestId}] Rate limit exceeded`);
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Too many subscription attempts. Please try again in a minute.",
    //     },
    //     { status: 429 },
    //   );
    // }

    log.error(`[${requestId}] Unhandled error in newsletter signup`, error, {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    return NextResponse.json(
      {
        error: "Error processing newsletter subscription",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
