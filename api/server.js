import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import brevo from "@getbrevo/brevo";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Helpers for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// --- API Route ---
app.post("/api/book", async (req, res) => {
  try {
    const { name, phone, pickup, drop, date, time, vehicle } = req.body;

    if (!name || !phone || !pickup || !drop) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📩 Booking received:", req.body);
    console.log("🔑 Using BREVO_API_KEY:", process.env.BREVO_API_KEY ? "✅ exists" : "❌ missing");

    const client = new brevo.TransactionalEmailsApi();
    client.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

    await client.sendTransacEmail({
      sender: { name: "FastPoint Cab", email: "fastpointcab@gmail.com" },
      to: [{ email: "fastpointcab@gmail.com" }],
      subject: "🚖 New Taxi Booking Request",
      htmlContent: `
        <h2>New Booking Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Drop:</b> ${drop}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
      `,
    });

    console.log("✅ Email sent successfully!");
    res.status(200).json({ success: true, message: "Booking sent successfully!" });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ Fallback: frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// --- Local development ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// --- Export for Vercel ---
export default app;
