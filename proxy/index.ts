import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = crypto.scryptSync(
  process.env.DATA_ENCRYPTION_KEY || "default_secret_key",
  "salt",
  32
);
const IV_LENGTH = 16;

//@ts-ignore
function encrypt(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    payload: encrypted,
  };
}

//@ts-ignore
function decrypt(encrypted) {
  const iv = Buffer.from(encrypted.iv, "base64");
  const tag = Buffer.from(encrypted.tag, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted.payload, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

async function run() {
  try {
    // Example payload for /status (server ignores body, but we send a valid encrypted object)
    const bodyToSend = {}; // or { foo: "bar" } for other endpoints
    const encryptedBody = encrypt(bodyToSend);

    console.log("Sending Encrypted Body -> ", encryptedBody);

    const res = await fetch("http://localhost:3000/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encryptedBody),
    });

    if (!res.ok) {
      console.error("HTTP error", res.status, await res.text());
      return;
    }

    const encryptedResponse = await res.json();

    console.log("Encrypted Response -> ", encryptedResponse);

    // Decrypt server response
    const decrypted = decrypt(encryptedResponse);
    console.log("🔓 Decrypted server response:");
    console.log(decrypted);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
