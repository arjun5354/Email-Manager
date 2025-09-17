import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Imap from "imap";
import { simpleParser } from "mailparser";
import Email from "./models/Email.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const imap = new Imap({
  user: "sales.finigenie@gmail.com",
  password: "xzqs mffw nxhc oqra", 
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

function categorizeEmail(subject = "", body = "") {
  const text = (subject + " " + body).toLowerCase();

  if (text.includes("lead") || text.includes("client") || text.includes("prospect")) {
    return "business-lead";
  } else if (text.includes("report") || text.includes("summary") || text.includes("analysis")) {
    return "report";
  } else {
    return "general";
  }
}

function fetchEmailsFromBox(boxName) {
  imap.openBox(boxName, false, (err) => {
    if (err) {
      console.error(` Error opening ${boxName}:`, err);
      return;
    }
    
    imap.search(["ALL"], (err, results) => {
      if (err) {
        console.error(` Search error in ${boxName}:`, err);
        return;
      }
      if (!results.length) {
        console.log(` No emails found in ${boxName}.`);
        return;
      }
      console.log("Receved")

      const f = imap.fetch(results, { bodies: "" });
      f.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, async (err, parsed) => {
            if (err) {
              console.error("Parser error:", err);
              return;
            }
            
            try {
              const messageId = parsed.messageId;
              const senderName = parsed.from?.value[0]?.name || parsed.from?.value[0]?.address;
              const senderEmail = parsed.from?.value[0]?.address;
              const subject = parsed.subject || "(No Subject)";
              const body = parsed.text || "";
              const category = categorizeEmail(subject, body);

              const existing = await Email.findOne({ messageId });

              if (existing) {
                existing.sender = senderName;
                existing.senderEmail = senderEmail;
                existing.subject = subject;
                existing.category = category;
                existing.timestamp = parsed.date || new Date();
                existing.preview = body.substring(0, 120);
                await existing.save();
                console.log(`Email updated: ${subject} (${senderEmail})`);
              } else {
                await Email.create({
                  messageId,
                  sender: senderName,
                  senderEmail,
                  subject,
                  category,
                  timestamp: parsed.date || new Date(),
                  preview: body.substring(0, 120)
                });
                console.log(`New email inserted: ${subject} (${senderEmail})`);
              }
            } catch (dbErr) {
              console.error("Mongo save error:", dbErr);
            }
          });
        });
      });

      f.once("end", () => {
        console.log(`📬 Done fetching emails from ${boxName}`);
      });
    });
  });
}

imap.once("ready", () => {
  console.log("📡 IMAP connected, fetching emails...");
  fetchEmailsFromBox("INBOX");
  fetchEmailsFromBox("[Gmail]/Sent Mail");

  imap.on("mail", () => {
    console.log("📩 New email detected, fetching...");
    fetchEmailsFromBox("INBOX");
    // fetchEmailsFromBox("[Gmail]/Sent Mail");
  });
});

imap.once("error", (err) => {
  console.error("❌ IMAP error:", err);
});

imap.once("end", () => {
  console.log("⚠️ IMAP connection ended. Reconnecting...");
  setTimeout(() => imap.connect(), 5000); 
});

// --- ROUTES ---
app.get("/api/emails", async (req, res) => {
  try {
    const emails = await Email.find().sort({ timestamp: -1 });
    res.json(emails);
  } catch (err) {
    console.error("❌ API error:", err);
    res.status(500).send("Error fetching emails from database.");
  }
});

// --- STARTUP FLOW ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    imap.connect(); // start IMAP only after Mongo is ready

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
