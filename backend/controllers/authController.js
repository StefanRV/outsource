require('dotenv').config();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { TextEncoder } = require('util');
const { SignJWT } = require('jose');
const nodemailer = require("nodemailer");

const CODE_EXPIRATION_MINUTES = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}

const verificationCodes = new Map();

exports.signup = async (req, res) => {
  try {
    const { username, email, passwords, confirmPassword } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already taken!" });
    }

    if (passwords !== confirmPassword) {
      return res.status(400).send({ message: "Passwords do not match!" });
    }

    const code = generateVerificationCode();
    const expiresAt = Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000;

    // const hashedPassword = bcrypt.hashSync(passwords, 10);
    console.log('Signup - Hashed Password:', passwords);

    verificationCodes.set(email, {
      code,
      expiresAt,
      userData: { username, email, passwords: passwords },
    });

    await transporter.sendMail({
      from: `"EduGate" <${process.env.EMAIL}>`,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.status(200).send({ message: "Verification code sent to your email." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.verifyCodeAndRegister = async (req, res) => {
  try {
    const { email, code } = req.body;
    const entry = verificationCodes.get(email);

    if (!entry) {
      return res.status(400).send({ message: "No verification code found for this email." });
    }

    if (Date.now() > entry.expiresAt) {
      verificationCodes.delete(email);
      return res.status(400).send({ message: "Verification code has expired." });
    }

    if (entry.code !== code) {
      return res.status(400).send({ message: "Invalid verification code." });
    }
    // const hashedPassword = bcrypt.hashSync(passwords, 10);
    const { username, passwords: hashedPassword } = entry.userData;

    console.log('Verify - Creating user with hashed password:', hashedPassword);

    const user = await User.create({ username, email, passwords: hashedPassword });

    console.log('Verify - User created:', user.toJSON());

    verificationCodes.delete(email);

    const jwtSecret = new TextEncoder().encode(process.env.SECRET);
    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(jwtSecret);

    res.status(201).send({
      message: "User registered successfully!",
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.passwords,
      user.passwords
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const secret = new TextEncoder().encode(process.env.SECRET);

    const token = await new SignJWT({ id: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const jwt = require("jsonwebtoken"); 
    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.id;

    const user = await User.findByPk(userId, {
      attributes: ["username", "email"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving profile" });
  }
};
