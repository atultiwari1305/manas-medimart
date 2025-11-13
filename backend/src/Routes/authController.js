const patientModel = require("../Models/patient");
const adminModel = require("../Models/Admin");
const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const pharmaModel = require('../Models/Pharmacist.js');
const otpModel = require("../Models/Otp");

const multer = require('multer');
const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../Utilities/SendEmail");
const { createSecretToken } = require("../Utilities/SecretToken");

// ===== Helper: set cookie with correct options =====
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,         // HTTPS required
    sameSite: 'none',     // cross-origin
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
};

// ====================== PATIENT REGISTER ======================
module.exports.PatientRegister = async (req, res) => {
  try {
    const { username, password, name, email, dob, gender, mobile, EmergencyContact_Name, EmergencyContact_MobileNumber, EmergencyContact_Relation } = req.body;

    // Check username uniqueness across collections
    const exists = await patientModel.findOne({ Username: username }) ||
                   await pharmaModel.findOne({ Username: username }) ||
                   await adminModel.findOne({ Username: username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await patientModel.create({
      Username: username,
      Name: name,
      Email: email,
      Password: hashedPassword,
      DateOfBirth: dob,
      Gender: gender,
      MobileNumber: mobile,
      EmergencyContact_Name,
      EmergencyContact_MobileNumber,
      EmergencyContact_Relation
    });

    const token = createSecretToken(user._id, 'patient');
    setTokenCookie(res, token);

    res.status(201).json({ message: "User signed in successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== PHARMACIST REGISTER ======================
module.exports.pharmaRegister = async (req, res) => {
  try {
    const { username, password, name, email, dob, hourly_rate, affiliation, educational_background } = req.body;

    // Check existing usernames in all collections
    const exists = await patientModel.findOne({ Username: username }) ||
                   await pharmaModel.findOne({ Username: username }) ||
                   await adminModel.findOne({ Username: username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Validate file uploads
    const IDDocument = req.files.IDDocument?.[0];
    const pharmacyDegreeDocument = req.files.pharmacyDegreeDocument?.[0];
    const workingLicenseDocument = req.files.workingLicenseDocument?.[0];

    if (!IDDocument || !pharmacyDegreeDocument || !workingLicenseDocument) {
      return res.status(400).json({ message: 'Please upload all required documents.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pharmaReqModel.create({
      Username: username,
      Name: name,
      Email: email,
      Password: hashedPassword,
      DateOfBirth: dob,
      HourlyRate: hourly_rate,
      Affiliation: affiliation,
      EducationalBackground: educational_background,
      IDDocument: { data: IDDocument.buffer, contentType: IDDocument.mimetype },
      pharmacyDegreeDocument: { data: pharmacyDegreeDocument.buffer, contentType: pharmacyDegreeDocument.mimetype },
      workingLicenseDocument: { data: workingLicenseDocument.buffer, contentType: workingLicenseDocument.mimetype },
    });

    return res.status(201).json({ message: "Pharmacist application submitted successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== ADMIN REGISTER ======================
module.exports.addAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check username uniqueness
    const exists = await patientModel.findOne({ Username: username }) ||
                   await pharmaModel.findOne({ Username: username }) ||
                   await adminModel.findOne({ Username: username });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await adminModel.create({ Username: username, Password: hashedPassword, Email: email });

    const token = createSecretToken(user._id, 'admin');
    setTokenCookie(res, token);

    res.status(201).json({ message: "Admin created successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== LOGIN ======================
module.exports.Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

    // Find user
    let loggedIn = await patientModel.findOne({ Username: username });
    let role = 'patient';

    if (!loggedIn) {
      loggedIn = await pharmaModel.findOne({ Username: username });
      role = 'pharmacist';
    }
    if (!loggedIn) {
      loggedIn = await adminModel.findOne({ Username: username });
      role = 'admin';
    }
    if (!loggedIn) return res.status(404).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, loggedIn.Password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = createSecretToken(loggedIn._id, role);
    setTokenCookie(res, token);

    res.status(200).json({ message: "User logged in successfully", success: true, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== CURRENT USER ======================
module.exports.currentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ status: false });

    const data = jwt.verify(token, process.env.TOKEN_KEY);
    let user;
    if (data.role === 'patient') user = await patientModel.findById(data.id);
    if (data.role === 'pharmacist') user = await pharmaModel.findById(data.id);
    if (data.role === 'admin') user = await adminModel.findById(data.id);

    if (!user) return res.json({ status: false });
    res.json({ status: true, user: user.Username, role: data.role });
  } catch (err) {
    console.error(err);
    res.json({ status: false });
  }
};

// ====================== LOGOUT ======================
module.exports.Logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0)
  });
  res.status(200).json({ message: 'User logged out successfully', success: true });
};

// ====================== CHANGE PASSWORD ======================
module.exports.ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const username = req.user.Username;

    let loggedIn = await patientModel.findOne({ Username: username }) ||
                   await pharmaModel.findOne({ Username: username }) ||
                   await adminModel.findOne({ Username: username });
    if (!loggedIn) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, loggedIn.Password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect old password' });

    if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
      return res.status(400).json({ message: 'New password does not meet requirements' });
    }

    loggedIn.Password = await bcrypt.hash(newPassword, 10);
    await loggedIn.save();

    const token = createSecretToken(loggedIn._id, req.user.role);
    setTokenCookie(res, token);

    res.status(201).json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== SEND OTP ======================
module.exports.SendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await patientModel.findOne({ Email: email }) ||
                 await pharmaModel.findOne({ Email: email }) ||
                 await adminModel.findOne({ Email: email });
    if (!user) return res.status(404).send("No account linked to this email");

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const status = await sendEmail(email, "Password reset", OTP);
    if (status) {
      await otpModel.deleteMany({ email });
      await otpModel.create({ email, otp: OTP, createdAt: Date.now(), expiresAt: Date.now() + 3600000 });
      return res.send("Password reset OTP sent to your email account");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// ====================== RESET PASSWORD ======================
module.exports.ResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const matchedOTP = await otpModel.findOne({ email });

    if (!matchedOTP || matchedOTP.expiresAt < Date.now() || matchedOTP.otp !== otp) {
      return res.status(400).send("OTP is invalid or expired");
    }

    let loggedIn = await patientModel.findOne({ Email: email }) ||
                   await pharmaModel.findOne({ Email: email }) ||
                   await adminModel.findOne({ Email: email });
    let role = loggedIn instanceof patientModel ? 'patient' : loggedIn instanceof pharmaModel ? 'pharmacist' : 'admin';

    loggedIn.Password = await bcrypt.hash(newPassword, 10);
    await loggedIn.save();

    const token = createSecretToken(loggedIn._id, role);
    setTokenCookie(res, token);

    res.status(201).json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ====================== CHECK OTP ======================
module.exports.CheckOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const matchedOTP = await otpModel.findOne({ email });

    if (!matchedOTP || matchedOTP.expiresAt < Date.now() || matchedOTP.otp !== otp) {
      return res.status(400).json({ message: 'OTP verification failed' });
    }

    return res.status(200).json({ message: 'OTP verification successful', success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ====================== RESET PASS (WITHOUT OTP) ======================
module.exports.ResetPass = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
      return res.status(400).json({ message: 'New password does not meet requirements' });
    }

    let loggedIn = await patientModel.findOne({ Email: email }) ||
                   await pharmaModel.findOne({ Email: email }) ||
                   await adminModel.findOne({ Email: email });
    let role = loggedIn instanceof patientModel ? 'patient' : loggedIn instanceof pharmaModel ? 'pharmacist' : 'admin';

    loggedIn.Password = await bcrypt.hash(newPassword, 10);
    await loggedIn.save();

    const token = createSecretToken(loggedIn._id, role);
    setTokenCookie(res, token);

    res.status(201).json({ message: 'Password changed successfully', success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
