import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  );
  process.exit(1);
}

const rl = createInterface({ input, output });

async function prompt(question) {
  const answer = await rl.question(question);
  return answer.trim();
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  const emailArg = process.argv.find((a) => a.startsWith("--email="));
  const email = emailArg
    ? emailArg.split("=")[1]
    : await prompt("Enter test email: ");

  if (!email) {
    console.error("Email is required.");
    process.exit(1);
  }

  console.log(`\n1) Sending OTP to ${email} ...`);
  const { data: sendData, error: sendError } =
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
      type: "email", // <--- explicitly request OTP flow, not magic link
    });

  if (sendError) {
    console.error("Failed to send OTP:", sendError);
    process.exit(1);
  }

  console.log("OTP sent. Check the inbox and copy the 6-digit code.");
  const tokenArg = process.argv.find((a) => a.startsWith("--otp="));
  const token = tokenArg
    ? tokenArg.split("=")[1]
    : await prompt("Enter OTP code: ");

  if (!token) {
    console.error("OTP code is required.");
    process.exit(1);
  }

  console.log("\n2) Verifying OTP ...");
  const { data: verifyData, error: verifyError } =
    await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

  if (verifyError) {
    console.error("Failed to verify OTP:", verifyError);
    process.exit(1);
  }

  console.log("Success! Session created:");
  console.log({
    user: verifyData?.user,
    access_token: verifyData?.session?.access_token ? "[redacted]" : null,
    refresh_token: verifyData?.session?.refresh_token ? "[redacted]" : null,
    expires_at: verifyData?.session?.expires_at || null,
  });
}

main()
  .catch((e) => {
    console.error("Unexpected error:", e);
    process.exit(1);
  })
  .finally(() => rl.close());
