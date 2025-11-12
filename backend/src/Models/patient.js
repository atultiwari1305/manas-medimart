const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Schema for medical documents
const medicalDocumentSchema = new mongoose.Schema({
  name: String,
  path: String,
});

// Schema for chat rooms
const chatSchema = new mongoose.Schema({
  room: {
    type: String,
    // unique removed to prevent duplicate key errors
  },
  doctorUsername: String,
  username: String,
  messages: [
    {
      sender: String,
      recipient: String,
      message: String,
      timestamp: {
        type: String,
        default: () => `${new Date().getHours()}:${new Date().getMinutes()}`,
      },
    },
  ],
});

// Main patient schema
const patientSchema = new Schema({
  Username: { type: String, required: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  DateOfBirth: { type: Date, required: true },
  Gender: { type: String, required: true },
  MobileNumber: { type: Number, required: true },
  EmergencyContact_Name: { type: String, required: true },
  EmergencyContact_MobileNumber: { type: Number, required: true },
  EmergencyContact_Relation: { type: String, required: true },
  WalletBalance: { type: Number, default: 0 },
  chatRooms: { type: [chatSchema], default: [] },
  DeliveryAddress: { type: [String], default: [] },
  Notifications: { type: [String], default: [] },
  LinkedPatientFam: [
    new Schema({
      memberID: mongoose.Schema.Types.ObjectId,
      username: String,
      relation: String,
    }),
  ],
  healthPackage: [
    new Schema({
      _id: mongoose.Schema.Types.ObjectId,
      Package_Name: String,
      Price: Number,
      Session_Discount: Number,
      Pharmacy_Discount: Number,
      Family_Discount: Number,
      Status: { type: String, enum: ['Subscribed', 'Unsubscribed','Cancelled'], default: 'Unsubscribed' },
      Renewl_Date: Date,
      End_Date: Date,
      Owner: Boolean,
    }),
  ],
  medicalHistory: [medicalDocumentSchema],
  Prescriptions: [
    new Schema({
      Medicine: [
        new Schema({
          MedicineID: String,
          MedicineName: String,
          Onboard: Boolean,
          Dose: String,
          Quantity: Number,
          Instructions: String,
        }),
      ],
      DocUsername: String,
      PrecriptionDate: Date,
      Status: { type: String, enum: ['Filled', 'Unfilled'] },
    }),
  ],
  BookedAppointments: [
    new Schema({
      _id: mongoose.Schema.Types.ObjectId,
      DoctorUsername: String,
      DoctorName: String,
      StartDate: Date,
      EndDate: Date,
      Price: Number,
      Status: { type: String, enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'] },
    }),
  ],
  FamilyBookedAppointments: [
    new Schema({
      _id: mongoose.Schema.Types.ObjectId,
      PatientName: String,
      DoctorUsername: String,
      DoctorName: String,
      StartDate: Date,
      EndDate: Date,
      Price: Number,
      Status: { type: String, enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'] },
    }),
  ],
  familyMembers: [
    new Schema({
      MemberName: { type: String, required: true, default: 'null' },
      NationalID: { type: Number, required: true, default: 0 },
      Age: { type: Number, required: true, default: 0 },
      Gender: { type: String, required: true, default: 'Unknown' },
      Relation: { type: String, required: true, default: 'Unknown' },
    }),
  ],
  HealthRecords: [
    {
      PatientName: { type: String, required: true },
      DoctorName: { type: String, required: true },
      RecordDetails: { type: String, required: true },
      RecordDate: { type: Date, required: true },
    },
  ],
}, { timestamps: true });

// Hash password before save
patientSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('Password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.Password, salt, (error, hash) => {
      if (error) return next(error);
      user.Password = hash;
      next();
    });
  });
});

const Patient = mongoose.model('patients', patientSchema);
module.exports = Patient;
