const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const emailTemplate = (text) => `
    <div className="email" style="
        border: ipx solid black;
        padding: 20px;
        font-family: sans-serif;
        font-size: 20px;
    ">
        <h2>Pozdrav!</h2>
        <p>${text}</p>

        <p>Hvala!</p>
    </div>
`;

exports.transport = transport;
exports.emailTemplate = emailTemplate;
