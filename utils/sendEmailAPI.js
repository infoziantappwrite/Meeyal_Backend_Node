const fetch = require("node-fetch");

const sendEmail = async (mailTo, message) => {
  await fetch("https://mailer-api-production-76e4.up.railway.app/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mailTo,
      message,
      time: new Date().toLocaleString(),
    }),
  });
};

module.exports = sendEmail;
