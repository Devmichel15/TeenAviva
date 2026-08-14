/**
 * Debug test: Check what schema actually exists in the remote devotionals table
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing environment variables: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugSchema() {
  console.log("🔍 Debugging remote schema...\n");

  // Create a test user
  const testEmail = `debug-${Math.random().toString(36).substring(7)}@test.com`;
  const testPass = "TestPassword123!";

  console.log("Creating test user:", testEmail);
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPass,
  });

  if (signupError) {
    console.error("Signup error:", signupError);
    return;
  }

  const userId = signupData.user?.id;
  console.log("Test user ID:", userId);

  // Try to insert with OLD schema (title field)
  console.log("\n1️⃣ Attempting insert with old schema (title field):");
  const { error: oldSchemaError } = await supabase.from("devotionals").insert({
    title: "Old Schema Test",
    created_by: userId,
  });

  if (oldSchemaError) {
    console.log("   ❌ Error:", oldSchemaError.message);
  } else {
    console.log("   ✅ Success - OLD SCHEMA IS STILL IN USE");
  }

  // Try to insert with NEW schema (content + author_id)
  console.log("\n2️⃣ Attempting insert with new schema (content + author_id):");
  const { error: newSchemaError, data: newData } = await supabase
    .from("devotionals")
    .insert({
      author_id: userId,
      content: "New Schema Test",
    });

  if (newSchemaError) {
    console.log("   ❌ Error:", newSchemaError.message);
  } else {
    console.log("   ✅ Success - NEW SCHEMA WORKS!");
    console.log("   Data:", newData);
  }

  // Try to query the raw table
  console.log("\n3️⃣ Querying devotionals table directly:");
  const { data: rawData, error: queryError } = await supabase
    .from("devotionals")
    .select("*")
    .limit(1);

  if (queryError) {
    console.log("   ❌ Query error:", queryError.message);
  } else if (rawData && rawData.length > 0) {
    console.log("   ✅ Query successful. Sample record:");
    const record = rawData[0];
    console.log("   Columns:", Object.keys(record).join(", "));
    console.log("   Record:", JSON.stringify(record, null, 2));
  } else {
    console.log("   ℹ️  No records in table");
  }
}

debugSchema();
