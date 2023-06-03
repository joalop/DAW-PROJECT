const nodemailer = require("nodemailer");
const path = require('path');
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname,'./.env') })


async function email( receiver, subject, content ){
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // gmail server
    port: 465, // gmail port
    secure: true, // Active
    auth: {

      user: process.env.EMAIL_USE, // user account
      pass: process.env.EMAIL_PASS// aplication password
    },
    tls: {
      rejectUnauthorized: false
    },
  });

  let logo = path.join(__dirname, '../../../public/images/Untitled-Design.png');

  let info = await transporter.sendMail({
    from: process.env.EMAIL_USE, // sender
    to: receiver, // receiver
    subject: subject, // Subject line
    text: content, // text plain
    html: `<h1> Delaibrary Team </h1> <p style="font-weight: bold"> ${content} </p>`, // contenido HTML
    attachments: [
      {
        filename: 'Delaibrary-Logo.png',
        path: `${logo}`,
      }
    ]
  });
}

module.exports = {
  email
};