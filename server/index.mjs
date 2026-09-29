// BugMind Backend Server
// Bridges the React frontend to the Hindsight memory system
//
// Endpoints:
//   POST /api/compile         – Simulated Java compiler
//   POST /api/memory/retain   – Store a debugging memory in Hindsight
//   POST /api/memory/recall   – Search Hindsight for similar past errors
//   POST /api/memory/reflect  – Ask Hindsight to synthesize insights
//   GET  /api/health          – Health check + Hindsight connectivity

import express from "express";
import cors from "cors";
import { HindsightClient } from "@vectorize-io/hindsight-client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Hindsight client ────────────────────────────────────────────────────────
const HINDSIGHT_BASE_URL = process.env.HINDSIGHT_BASE_URL || "http://localhost:8888";
const HINDSIGHT_API_KEY = process.env.HINDSIGHT_API_KEY || "";
const BANK_ID = process.env.HINDSIGHT_BANK_ID || "bugmind";

const clientOpts = { baseUrl: HINDSIGHT_BASE_URL };
if (HINDSIGHT_API_KEY) clientOpts.apiKey = HINDSIGHT_API_KEY;
const hindsight = new HindsightClient(clientOpts);

// ── Ensure bank exists on startup ───────────────────────────────────────────
async function ensureBank() {
  try {
    await hindsight.createBank(BANK_ID, {
      reflectMission: "You are BugMind, an AI debugging assistant. You remember the programmer's past Java debugging experiences. When asked, synthesize insights about their error patterns, recurring mistakes, and successful fixes.",
    });
    console.log(`  ✅ Hindsight bank "${BANK_ID}" ready`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("already exists") || msg.includes("409")) {
      console.log(`  ✅ Hindsight bank "${BANK_ID}" already exists`);
    } else {
      console.error(`  ⚠️  Could not create bank: ${msg}`);
    }
  }
}
ensureBank();

// ── Health check ────────────────────────────────────────────────────────────
app.get("/api/health", async (_req, res) => {
  try {
    await hindsight.recall(BANK_ID, "health-check");
    res.json({ status: "ok", hindsight: "connected", bankId: BANK_ID });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If bank just doesn't have memories yet, that's still connected
    if (msg.includes("no memories") || msg.includes("empty")) {
      res.json({ status: "ok", hindsight: "connected", bankId: BANK_ID });
    } else {
      res.json({
        status: "ok",
        hindsight: "disconnected",
        error: msg,
        bankId: BANK_ID,
      });
    }
  }
});

// ── Simulated Java Compiler ─────────────────────────────────────────────────
app.post("/api/compile", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  // Array index out of bounds detection
  const arrayDeclRegex = /(?:int|String|double|float|long|char|boolean)\[\]\s+(\w+)\s*=\s*\{([^}]+)\}/g;
  let match;
  const arrays = {};
  while ((match = arrayDeclRegex.exec(code)) !== null) {
    arrays[match[1]] = match[2].split(",").map((e) => e.trim()).length;
  }

  const arrayAccessRegex = /(\w+)\[(\d+)\]/g;
  while ((match = arrayAccessRegex.exec(code)) !== null) {
    const varName = match[1];
    const index = parseInt(match[2], 10);
    if (arrays[varName] !== undefined && index >= arrays[varName]) {
      return res.json({
        success: false,
        output: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index ${index} out of bounds for length ${arrays[varName]}`,
        errorType: "ArrayIndexOutOfBoundsException",
        errorMessage: `Index ${index} out of bounds for length ${arrays[varName]}`,
      });
    }
  }

  // Null pointer detection
  if (code.includes("null") && /\.\w+\(/.test(code)) {
    const nullAssign = /(\w+)\s*=\s*null\s*;/.exec(code);
    if (nullAssign) {
      const varName = nullAssign[1];
      const methodCall = new RegExp(`${varName}\\s*\\.\\s*\\w+\\s*\\(`);
      if (methodCall.test(code)) {
        return res.json({
          success: false,
          output: `Exception in thread "main" java.lang.NullPointerException: Cannot invoke method because "${varName}" is null`,
          errorType: "NullPointerException",
          errorMessage: `Cannot invoke method because "${varName}" is null`,
        });
      }
    }
  }

  // Incompatible types
  if (/\bString\s+\w+\s*=\s*\d+\s*;/.test(code)) {
    return res.json({
      success: false,
      output: "error: incompatible types: int cannot be converted to String",
      errorType: "IncompatibleTypes",
      errorMessage: "incompatible types: int cannot be converted to String",
    });
  }

  // String index out of bounds
  const charAtMatch = /\.charAt\((\d+)\)/.exec(code);
  if (charAtMatch && parseInt(charAtMatch[1]) > 5) {
    return res.json({
      success: false,
      output: `java.lang.StringIndexOutOfBoundsException: String index out of range: ${charAtMatch[1]}`,
      errorType: "StringIndexOutOfBoundsException",
      errorMessage: `String index out of range: ${charAtMatch[1]}`,
    });
  }

  // Success
  res.json({
    success: true,
    output: "Compilation successful.\nProgram exited with code 0.",
  });
});

// ── Memory: Retain ──────────────────────────────────────────────────────────
// Stores a debugging experience in Hindsight
app.post("/api/memory/retain", async (req, res) => {
  const { errorType, errorMessage, code, cause, aiExplanation, suggestedFix, userFix, outcome } = req.body;

  // Build a structured memory document for Hindsight
  const content = [
    `[BugMind Debugging Memory]`,
    `Error Type: ${errorType}`,
    `Error Message: ${errorMessage}`,
    `Language: Java`,
    `Cause: ${cause}`,
    `AI Explanation: ${aiExplanation}`,
    `Suggested Fix: ${suggestedFix}`,
    userFix ? `User's Actual Fix: ${userFix}` : null,
    `Outcome: ${outcome}`,
    `Code Context:\n${code}`,
    `Timestamp: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await hindsight.retain(BANK_ID, content);
    res.json({ success: true, message: "Memory stored in Hindsight" });
  } catch (err) {
    console.error("Hindsight retain error:", err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// ── Memory: Recall ──────────────────────────────────────────────────────────
// Searches Hindsight for similar past debugging experiences
app.post("/api/memory/recall", async (req, res) => {
  const { errorType, errorMessage } = req.body;
  const query = `Java error: ${errorType}. ${errorMessage || ""}`.trim();

  try {
    const results = await hindsight.recall(BANK_ID, query);

    if (results && results.memories && results.memories.length > 0) {
      // Parse the most relevant memory
      const topMemory = results.memories[0];
      const text = topMemory.text || topMemory.content || "";

      // Extract structured fields from the stored text
      const extract = (label) => {
        const regex = new RegExp(`${label}:\\s*(.+?)(?:\\n|$)`, "i");
        const m = regex.exec(text);
        return m ? m[1].trim() : "";
      };

      res.json({
        found: true,
        memory: {
          errorType: extract("Error Type") || errorType,
          cause: extract("Cause"),
          aiExplanation: extract("AI Explanation"),
          suggestedFix: extract("Suggested Fix"),
          userFix: extract("User's Actual Fix"),
          outcome: extract("Outcome"),
          raw: text,
        },
        relevance: topMemory.relevance || topMemory.score || null,
        totalMatches: results.memories.length,
      });
    } else {
      res.json({ found: false });
    }
  } catch (err) {
    console.error("Hindsight recall error:", err);
    // If Hindsight is unreachable, return not-found rather than crashing
    res.json({ found: false, error: err instanceof Error ? err.message : String(err) });
  }
});

// ── Memory: Reflect ─────────────────────────────────────────────────────────
// Asks Hindsight to synthesize an answer from accumulated memories
app.post("/api/memory/reflect", async (req, res) => {
  const { question } = req.body;

  try {
    const result = await hindsight.reflect(BANK_ID, question);
    res.json({
      success: true,
      answer: result.response || result.text || result,
    });
  } catch (err) {
    console.error("Hindsight reflect error:", err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// ── Start server ────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3001", 10);
app.listen(PORT, () => {
  console.log(`\n  🧠 BugMind API server running on http://localhost:${PORT}`);
  console.log(`  📡 Hindsight endpoint: ${HINDSIGHT_BASE_URL}`);
  console.log(`  🔑 API key: ${HINDSIGHT_API_KEY ? "configured" : "not set"}`);
  console.log(`  🗄️  Memory bank: ${BANK_ID}\n`);
});
