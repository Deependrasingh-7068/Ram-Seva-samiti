const mongoose = require('mongoose');

const OfficeBearerSchema = new mongoose.Schema(
  {
    bearerId: { 
      type: String, 
      unique: true, 
      required: true,
      index: true 
    },
    designation: { 
      type: String, 
      required: true, 
      enum: ['Patron', 'President', 'General Secretary', 'Treasurer', 'Media In-charge'],
      unique: true, // Yeh ensure karega ki database mein har designation ka sirf 1 hi document ho
      index: true 
    },
    designationHindi: { 
      type: String, 
      required: true 
    },
    nameHindi: { 
      type: String, 
      required: true 
    },
    nameEnglish: { 
      type: String, 
      default: '' 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    contact: { 
      type: String, 
      default: 'NA' 
    },
    aadhaarNumber: { 
      type: String, 
      required: true 
    },
    dob: { 
      type: String, 
      required: true, // Format: DDMMYYYY (Aadhaar unlock verification ke liye)
    },
    photo: { 
      type: String, 
      default: '' 
    },
        quote: { 
      type: String, 
      default: '' 
    },
    isFrozen: { 
      type: Boolean, 
      default: false 
    },
    assignedBy: { 
      type: String, 
      default: 'SuperAdmin' 
    }
  },
  { 
    timestamps: true,
    collection: 'office_bearers'
  }
);

if (mongoose.models.OfficeBearer) {
  delete mongoose.models.OfficeBearer;
}

const OfficeBearer = mongoose.model('OfficeBearer', OfficeBearerSchema);

module.exports = OfficeBearer;