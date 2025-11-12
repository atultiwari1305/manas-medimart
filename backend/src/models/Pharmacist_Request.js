// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const bcrypt = require("bcryptjs");

// const pharmaReqSchema = new Schema({
//   Username: {
//     type: String,
//     required: true,
//   },
//   Name: {
//     type: String,
//     required: true,
//   },
//   Email: {
//     type: String,
//     required: true
//   },
//   Password: {
//     type: String,
//     required: true,
//   },
//   DateOfBirth:{
//     type: Date,
//     required: true,
//   },
//     HourlyRate: {
//         type: Number,
//         required: true,
//     },
//     Affiliation: {
//         type: String,
//         required: true,
//     },
//     EducationalBackground: {
//         type: String,
//         required: true,
//     },
//     IDDocument: {
//       data: Buffer, 
//       contentType: String, // content type ( application/pdf)
      
//     },
//     pharmacyDegreeDocument: {
//       data: Buffer,
//       contentType: String,
      
//     },
//     workingLicenseDocument: {
//       data: Buffer,
//       contentType: String,
    
//     }

// }, { timestamps: true });
// pharmaReqSchema.pre('save', function(next) {
//   const user = this;
//   if (!user.isModified('Password')) {
//     return next();
//   }
//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }
//     bcrypt.hash(user.Password, salt, (error, hash) => {
//       if (error) {
//         return next(error);
//       }
//       console.log('HASH: ', hash);
//       user.Password = hash;
//       console.log('USER.PASSWORD: ', user.Password);
//       next();
//     });
//   });
// });

// const pharma_req = mongoose.model('Pharmacist_Request', pharmaReqSchema);
// module.exports = pharma_req;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pharmaReqSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true, // store the plain password here, hash later when approving
  },
  DateOfBirth: {
    type: Date,
    required: true,
  },
  HourlyRate: {
    type: Number,
    required: true,
  },
  Affiliation: {
    type: String,
    required: true,
  },
  EducationalBackground: {
    type: String,
    required: true,
  },
  IDDocument: {
    data: Buffer,
    contentType: String,
  },
  pharmacyDegreeDocument: {
    data: Buffer,
    contentType: String,
  },
  workingLicenseDocument: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

// Removed pre-save hashing
// Hash password only when approving the request

const pharma_req = mongoose.model('Pharmacist_Request', pharmaReqSchema);
module.exports = pharma_req;
