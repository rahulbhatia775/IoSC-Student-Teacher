import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// service account JSON filename (placed in backend root)
const keyFile = path.join(__dirname, "..", process.env.GOOGLE_SERVICE_ACCOUNT_FILE || "service-account.json");

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/drive"]
});

const drive = google.drive({ version: "v3", auth });

export default drive;
