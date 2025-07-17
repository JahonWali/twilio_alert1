const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: false }));

// Homepage route
app.get("/", (req, res) => {
  res.send(`
    <h2>🚨 Twilio Emergency Alert System</h2>
    <p>This service is running and ready to receive incoming calls from Twilio.</p>
    <p><strong>Status:</strong> Online ✅</p>
  `);
});

// Recipients to notify (WhatsApp via CallMeBot)
const recipients = [
  {
    phone: "+16048302649", // Jahon
    apikey: "2414417"
  },
  {
    phone: "+17785123726", // Sonita
    apikey: "2268054"
  }
];

// Twilio webhook - triggered when someone calls your Twilio number
app.post("/incoming-call", async (req, res) => {
  const time = new Date().toLocaleTimeString();
  const message = `🚨 Jahon just called the emergency number at ${time}.`;

  for (const r of recipients) {
    try {
      await axios.get("https://api.callmebot.com/whatsapp.php", {
        params: {
          phone: r.phone,
          text: message,
          apikey: r.apikey
        }
      });
      console.log(`✅ WhatsApp alert sent to ${r.phone}`);
    } catch (err) {
      console.error(`❌ Failed to send alert to ${r.phone}:`, err.message);
    }
  }

  // Respond with TwiML to play a voice message
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Say voice="alice">Your emergency alert has been sent. Help is on the way.</Say>
    </Response>
  `);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚨 Emergency alert system is running on port ${PORT}`);
});
