const router = require('express').Router();
const {
  Login,
  PatientRegister,
  upload,
  pharmaRegister,
  addAdmin,
  currentUser,
  Logout,
  ChangePassword,
  SendOTP,
  ResetPassword,
  ResetPass,
  CheckOTP
} = require('../Routes/authController'); // Make sure path is correct

const { userVerification } = require('../Middleware/AuthMiddleware');

// Get current user
router.get('/current-user', currentUser);

// Login
router.post('/login', Login);

// Patient Registration
router.post('/register', PatientRegister);

// Admin Registration
router.post('/admin', addAdmin);

// Logout
router.post('/logout', userVerification, Logout);

// Change Password
router.post('/change-password', userVerification, ChangePassword);

// Send OTP for password reset
router.post('/send-otp', SendOTP);

// Reset password using OTP
router.post('/reset-password', ResetPassword);

// Reset password directly
router.post('/reset-pass', ResetPass);

// Check OTP
router.post('/check-otp', CheckOTP);

// Pharmacist registration with document uploads
router.post('/pharma-register',
  upload.fields([
    { name: 'IDDocument', maxCount: 1 },
    { name: 'pharmacyDegreeDocument', maxCount: 1 },
    { name: 'workingLicenseDocument', maxCount: 1 },
  ]),
  pharmaRegister
);

module.exports = router;
