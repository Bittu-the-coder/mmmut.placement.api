/**
 * Basic integration tests for the MMMUT Placement API.
 * Run with: node test.js
 */

const http = require("http");
const app = require("./index");

const PORT = 4321;
let server;
let passed = 0;
let failed = 0;

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          reject(new Error(`Failed to parse JSON for ${path}: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

async function assert(description, fn) {
  try {
    await fn();
    console.log(`  ✔  ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${description}`);
    console.error(`     ${err.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(
      `${msg || "Assertion failed"}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

function assertArray(value, msg) {
  if (!Array.isArray(value)) {
    throw new Error(`${msg || "Expected array"}: got ${typeof value}`);
  }
}

function assertObject(value, msg) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${msg || "Expected object"}: got ${typeof value}`);
  }
}

async function runTests() {
  server = app.listen(PORT);

  console.log("\nRunning MMMUT Placement API tests...\n");

  // Root
  await assert("GET / returns 200 with endpoints list", async () => {
    const res = await request("/");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body.endpoints, "endpoints field");
  });

  // University
  await assert("GET /university returns university data", async () => {
    const res = await request("/university");
    assertEqual(res.status, 200, "Status");
    assertEqual(res.body.short_name, "MMMUT", "short_name");
  });

  // Programs
  await assert("GET /programs returns both UG and PG programs", async () => {
    const res = await request("/programs");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body.undergraduate, "undergraduate");
    assertObject(res.body.postgraduate, "postgraduate");
  });

  await assert("GET /programs/ug returns undergraduate programs", async () => {
    const res = await request("/programs/ug");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body.B_Tech, "B_Tech");
    assertArray(res.body.B_Tech.branches, "branches");
  });

  await assert("GET /programs/pg returns postgraduate programs", async () => {
    const res = await request("/programs/pg");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body.M_Tech, "M_Tech");
  });

  // Placement summary
  await assert("GET /placements/summary returns yearly summary array", async () => {
    const res = await request("/placements/summary");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body, "summary array");
    if (res.body.length < 1) throw new Error("Summary array is empty");
  });

  // Sessions list
  await assert("GET /placements/sessions lists available sessions", async () => {
    const res = await request("/placements/sessions");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body.all_sessions, "all_sessions");
    assertArray(res.body.sessions_with_detailed_data, "sessions_with_detailed_data");
  });

  // Detailed session data
  await assert("GET /placements/2021-22 returns full session data", async () => {
    const res = await request("/placements/2021-22");
    assertEqual(res.status, 200, "Status");
    assertEqual(res.body.session, "2021-22", "session field");
    assertArray(res.body.company_wise_placements, "company_wise_placements");
    assertObject(res.body.branch_wise_totals, "branch_wise_totals");
  });

  await assert("GET /placements/2022-23 returns full session data", async () => {
    const res = await request("/placements/2022-23");
    assertEqual(res.status, 200, "Status");
    assertEqual(res.body.session, "2022-23", "session field");
    assertArray(res.body.company_wise_placements, "company_wise_placements");
  });

  await assert("GET /placements/2021-22/branches returns branch totals", async () => {
    const res = await request("/placements/2021-22/branches");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body.branch_wise_totals, "branch_wise_totals");
  });

  await assert("GET /placements/2021-22/companies returns company list", async () => {
    const res = await request("/placements/2021-22/companies");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body.company_wise_placements, "company_wise_placements");
  });

  await assert("GET /placements/unknown returns 404", async () => {
    const res = await request("/placements/9999-00");
    assertEqual(res.status, 404, "Status should be 404");
  });

  // Achievements
  await assert("GET /achievements returns achievements array", async () => {
    const res = await request("/achievements");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body, "achievements array");
  });

  await assert("GET /achievements?session=2022-23 filters by session", async () => {
    const res = await request("/achievements?session=2022-23");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body.notable_achievements, "notable_achievements");
  });

  await assert("GET /achievements/top-packages returns top records", async () => {
    const res = await request("/achievements/top-packages");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body, "top packages array");
    if (res.body.length < 1) throw new Error("top-packages array is empty");
  });

  // Recruiters
  await assert("GET /recruiters returns all recruiter categories", async () => {
    const res = await request("/recruiters");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body.IT_Software, "IT_Software");
    assertArray(res.body.Core_Engineering, "Core_Engineering");
  });

  await assert("GET /recruiters?category=IT_Software returns filtered list", async () => {
    const res = await request("/recruiters?category=IT_Software");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body.recruiters, "recruiters array");
  });

  await assert("GET /recruiters?category=invalid returns 404", async () => {
    const res = await request("/recruiters?category=invalid_category");
    assertEqual(res.status, 404, "Status should be 404");
  });

  // Alumni
  await assert("GET /alumni returns alumni array", async () => {
    const res = await request("/alumni");
    assertEqual(res.status, 200, "Status");
    assertArray(res.body, "alumni array");
    if (res.body.length < 1) throw new Error("alumni array is empty");
  });

  // Master data
  await assert("GET /all returns complete master dataset", async () => {
    const res = await request("/all");
    assertEqual(res.status, 200, "Status");
    assertObject(res.body, "master data object");
    assertObject(res.body.university, "university in master data");
  });

  // 404 handler
  await assert("GET /unknown returns 404 with hint", async () => {
    const res = await request("/this-does-not-exist");
    assertEqual(res.status, 404, "Status should be 404");
    if (!res.body.hint) throw new Error("Missing hint in 404 response");
  });

  server.close();

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  if (server) server.close();
  process.exit(1);
});
