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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/emails", async (req, res) => {
  const emails = await Email.find().sort({ timestamp: -1 });
  res.json(emails);
});

const imap = new Imap({
  user: "sales.finigenie@gmail.com",
  password: "xzqs mffw nxhc oqra",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}
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

imap.once("ready", () => {
  openInbox((err, box) => {
    if (err) throw err;
    imap.search(["ALL"], (err, results) => {
      if (err) throw err;
      if (!results.length) return console.log("No new emails.");

      const f = imap.fetch(results, { bodies: "" });
      f.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, async (err, parsed) => {
            if (err) throw err;

            const messageId = parsed.messageId; 
            const senderName = parsed.from.value[0].name || parsed.from.value[0].address;
            const senderEmail = parsed.from.value[0].address;
            const subject = parsed.subject || "(No Subject)";
            const body = parsed.text || "";
            const category = categorizeEmail(subject, body);
            await Email.findOneAndUpdate(
              { messageId },
              {
                messageId,
                sender: senderName,
                senderEmail,
                subject,
                category,
                timestamp: parsed.date || new Date(),
                preview: body.substring(0, 120)
              },
              { upsert: true, new: true }
            );

          });
        });
      });

      f.once("end", () => {
        console.log("Done fetching emails.");
        imap.end();
      });
    });
  });
});

imap.connect();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
