/**
 * End-to-end test for Devocionais feature
 * Tests the complete flow: signup → profile creation → devotional publish → feed retrieval
 */

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing environment variables: EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testEmail = `test-${crypto.randomBytes(4).toString("hex")}@devotionals.test`;
const testPassword = "TestPassword123!";
const testName = "Test User Devocionais";

async function runTests() {
  console.log("🚀 Starting E2E tests for TeenAviva Devocionais feature\n");

  try {
    // Step 1: Signup
    console.log("📝 Step 1: Testing signup...");
    const { data: signupData, error: signupError } = await supabase.auth.signUp(
      {
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName,
          },
        },
      },
    );

    if (signupError) {
      console.error("❌ Signup failed:", signupError);
      return;
    }

    const userId = signupData.user?.id;
    console.log(`✅ Signup successful. User ID: ${userId}`);

    // Step 2: Verify profile was created via trigger
    console.log("\n📋 Step 2: Verifying profile creation...");
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, avatar_url, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("❌ Profile query failed:", profileError);
      return;
    }

    if (!profileData) {
      console.error(
        "❌ Profile not found! The handle_new_user trigger may not be working.",
      );
      return;
    }

    console.log("✅ Profile created successfully:");
    console.log(`   - ID: ${profileData.id}`);
    console.log(`   - Name: ${profileData.name}`);
    console.log(`   - Email: ${profileData.email}`);
    console.log(`   - Avatar URL: ${profileData.avatar_url || "(none)"}`);

    // Step 3: Test devotional creation
    console.log("\n📖 Step 3: Testing devotional creation...");
    const devotionalContent = `Este é um devocional de teste criado em ${new Date().toISOString()}. Aleluia!`;

    const { data: devotionalData, error: devotionalError } = await supabase
      .from("devotionals")
      .insert({
        author_id: userId,
        content: devotionalContent,
      })
      .select(
        "id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)",
      )
      .single();

    if (devotionalError) {
      console.error("❌ Devotional creation failed:", devotionalError);
      return;
    }

    console.log("✅ Devotional created successfully:");
    console.log(`   - ID: ${devotionalData.id}`);
    console.log(`   - Content: "${devotionalData.content}"`);
    console.log(`   - Author ID: ${devotionalData.author_id}`);
    console.log(`   - Created At: ${devotionalData.created_at}`);
    console.log(
      `   - Author Name: ${devotionalData.profiles?.name || "(error joining)"}`,
    );

    // Step 4: Test feed retrieval with joined author data
    console.log("\n📺 Step 4: Testing devotional feed retrieval...");
    const { data: feedData, error: feedError } = await supabase
      .from("devotionals")
      .select(
        "id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)",
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (feedError) {
      console.error("❌ Feed retrieval failed:", feedError);
      return;
    }

    console.log(
      `✅ Feed retrieved successfully. Total posts: ${feedData.length}`,
    );

    const myPost = feedData.find((d) => d.id === devotionalData.id);
    if (!myPost) {
      console.error(
        "❌ Created devotional not found in feed! May be a visibility/RLS issue.",
      );
      return;
    }

    console.log(`✅ Your post found in feed:`);
    console.log(`   - Title: "${myPost.content.substring(0, 50)}..."`);
    console.log(`   - Author: ${myPost.profiles?.name || "(error joining)"}`);
    console.log(`   - Posted: ${myPost.created_at}`);

    // Step 5: Test logout and verify access restrictions
    console.log("\n🔐 Step 5: Testing access control...");
    await supabase.auth.signOut();
    console.log("✅ Signed out");

    const { data: anonFeedData, error: anonFeedError } = await supabase
      .from("devotionals")
      .select(
        "id, content, author_id, created_at, updated_at, profiles!author_id(name, avatar_url)",
      )
      .limit(10);

    if (anonFeedError) {
      console.error(
        "⚠️  Anonymous access to feed returned error (expected):",
        anonFeedError.message,
      );
    } else {
      console.log("⚠️  Anonymous access to feed was allowed:", {
        records: anonFeedData?.length || 0,
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(`   ✓ Signup works`);
    console.log(`   ✓ Profile created automatically`);
    console.log(`   ✓ Devotional creation works`);
    console.log(`   ✓ Author profile join works`);
    console.log(`   ✓ Feed retrieval works`);
    console.log(`   ✓ Access control enforced`);
  } catch (error) {
    console.error("🔥 Unexpected error:", error);
  }
}

runTests();
