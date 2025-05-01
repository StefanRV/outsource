require("dotenv").config();
const axios = require("axios");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const { env } = require("process");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to mail server:", error);
  } else {
    console.log("Mail server is ready to send messages");
  }
});
exports.contactForm = async (req, res) => {
  const { email, message, captchaToken } = req.body;
  //   console.log(
  //     `Request body: email=${email}, message=${message}, captchaToken=${
  //       captchaToken ? "provided" : "not provided"
  //     }`
  //   );

  if (!email || !message || !captchaToken) {
    console.log("Missing required fields: email, message or captchaToken");
    return res
      .status(400)
      .json({ error: "Все поля обязательны для заполнения" });
  }

  try {
    console.log("Verifying reCAPTCHA...");
    const googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    console.log("reCAPTCHA response:", googleResponse.data);

    if (!googleResponse.data.success) {
      return res.status(400).json({ error: "Ошибка верификации капчи" });
    }

    console.log("Preparing to send email...");
    const mailOptions = {
      from: "qwertyqwerty8123@gmail.com",
      to: "stefan.robalko@ivkhk.ee",
      subject: "Новое сообщение с сайта",
      text: `Message:\n\nEmail: ${email}\nСообщение: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    res.status(200).json({ message: "Сообщение успешно отправлено" });
  } catch (error) {
    console.error("Error during request handling:", error);
    res.status(500).json({ error: "Ошибка сервера", details: error.message });
  }
};
