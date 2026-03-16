const express = require("express");

const universityInfo = require("./university_info.json");
const academicPrograms = require("./academic_programs.json");
const placementSummary = require("./placement_summary_yearly.json");
const placements202122 = require("./placements_2021_22.json");
const placements202223 = require("./placements_2022_23.json");
const notableAchievements = require("./notable_achievements.json");
const recruitersAndAlumni = require("./recruiters_and_alumni.json");
const masterData = require("./mmmut_placement_api_master.json");

const app = express();
const PORT = process.env.PORT || 3000;

// Map session strings to their detailed placement data
const sessionData = {
  "2021-22": placements202122,
  "2022-23": placements202223,
};

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "MMMUT Placement API",
    description:
      "REST API for Madan Mohan Malaviya University of Technology Training & Placement Cell data",
    version: "1.0.0",
    base_url: req.protocol + "://" + req.get("host"),
    endpoints: {
      "GET /university": "University information, contact details and rankings",
      "GET /programs": "Academic programs (UG, PG)",
      "GET /programs/ug": "Undergraduate programs",
      "GET /programs/pg": "Postgraduate programs",
      "GET /placements/summary": "Year-wise placement summary (2016-17 to 2024-25)",
      "GET /placements/sessions": "List of sessions with available detailed data",
      "GET /placements/:session":
        "Detailed placement data for a session (e.g. 2021-22, 2022-23)",
      "GET /placements/:session/branches":
        "Branch-wise placement totals for a session",
      "GET /placements/:session/companies":
        "Company-wise placement details for a session",
      "GET /achievements": "Notable student achievements and records",
      "GET /achievements/top-packages": "All-time top package records",
      "GET /recruiters": "Past recruiters categorised by domain",
      "GET /alumni": "Prominent alumni",
      "GET /all": "Complete master dataset",
    },
  });
});

// ─── University ───────────────────────────────────────────────────────────────
app.get("/university", (req, res) => {
  res.json(universityInfo.university);
});

// ─── Academic Programs ────────────────────────────────────────────────────────
app.get("/programs", (req, res) => {
  res.json(academicPrograms.academic_programs);
});

app.get("/programs/ug", (req, res) => {
  res.json(academicPrograms.academic_programs.undergraduate);
});

app.get("/programs/pg", (req, res) => {
  res.json(academicPrograms.academic_programs.postgraduate);
});

// ─── Placements ───────────────────────────────────────────────────────────────
app.get("/placements/summary", (req, res) => {
  res.json(placementSummary.placement_summary_yearly);
});

app.get("/placements/sessions", (req, res) => {
  const available = Object.keys(sessionData);
  const all = placementSummary.placement_summary_yearly.map((s) => s.session);
  res.json({
    all_sessions: all,
    sessions_with_detailed_data: available,
  });
});

app.get("/placements/:session", (req, res) => {
  const session = req.params.session;
  const data = sessionData[session];
  if (!data) {
    const available = Object.keys(sessionData);
    return res.status(404).json({
      error: `No detailed placement data found for session '${session}'.`,
      available_sessions: available,
    });
  }
  res.json(data);
});

app.get("/placements/:session/branches", (req, res) => {
  const session = req.params.session;
  const data = sessionData[session];
  if (!data) {
    const available = Object.keys(sessionData);
    return res.status(404).json({
      error: `No detailed placement data found for session '${session}'.`,
      available_sessions: available,
    });
  }
  res.json({
    session: data.session,
    branch_wise_totals: data.branch_wise_totals,
  });
});

app.get("/placements/:session/companies", (req, res) => {
  const session = req.params.session;
  const data = sessionData[session];
  if (!data) {
    const available = Object.keys(sessionData);
    return res.status(404).json({
      error: `No detailed placement data found for session '${session}'.`,
      available_sessions: available,
    });
  }
  res.json({
    session: data.session,
    summary: data.summary,
    company_wise_placements: data.company_wise_placements,
  });
});

// ─── Achievements ─────────────────────────────────────────────────────────────
app.get("/achievements", (req, res) => {
  const { session } = req.query;
  if (session) {
    const filtered = notableAchievements.notable_achievements.filter(
      (a) => a.session === session || a.session.startsWith(session)
    );
    return res.json({ session, notable_achievements: filtered });
  }
  res.json(notableAchievements.notable_achievements);
});

app.get("/achievements/top-packages", (req, res) => {
  res.json(notableAchievements.top_package_records);
});

// ─── Recruiters ───────────────────────────────────────────────────────────────
app.get("/recruiters", (req, res) => {
  const { category } = req.query;
  const recruiters = recruitersAndAlumni.past_recruiters_all_time;
  if (category) {
    const key = Object.keys(recruiters).find(
      (k) => k.toLowerCase() === category.toLowerCase()
    );
    if (!key) {
      return res.status(404).json({
        error: `Category '${category}' not found.`,
        available_categories: Object.keys(recruiters),
      });
    }
    return res.json({ category: key, recruiters: recruiters[key] });
  }
  res.json(recruiters);
});

// ─── Alumni ───────────────────────────────────────────────────────────────────
app.get("/alumni", (req, res) => {
  res.json(recruitersAndAlumni.prominent_alumni);
});

// ─── Master / All data ────────────────────────────────────────────────────────
app.get("/all", (req, res) => {
  res.json(masterData);
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found.",
    hint: "Visit GET / for a list of all available endpoints.",
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`MMMUT Placement API is running on http://localhost:${PORT}`);
});

module.exports = app;
