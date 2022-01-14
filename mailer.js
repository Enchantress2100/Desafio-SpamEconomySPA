//function enviar
const nodemailer = require("nodemailer");
async function enviar(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "manosdepilar@gmail.com",
      pass: "enchantress_mia2100",
    },
  });
  let mailOptions = {
    from: "manosdepilar@gmail.com",
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err, 'Hay un error, revise que no falten caracteres');
    if (data) console.log(data, 'Correo enviado con exito');
  });
}

module.exports = enviar;
