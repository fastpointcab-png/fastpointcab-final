import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import brevo from "@getbrevo/brevo";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get current directory for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve frontend (index.html, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Booking API route
app.post("/api/book", async (req, res) => {
  try {
    const { name, phone, pickup, drop, date, time, vehicle } = req.body;

    if (!name || !phone || !pickup || !drop) {
      return res.status(400).json({ error: "Missing required fields" });
    }

 // ✅ Correct Brevo client initialization (v1.0.1)
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const client = new brevo.TransactionalEmailsApi();

apiKey.apiKey = process.env.BREVO_API_KEY;


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

    res.status(200).json({ success: true, message: "Booking sent successfully!" });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Fallback — send index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// ✅ Local test (Vercel auto-handles production)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

export default app;
