import mongoose from 'mongoose';

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Temple name is required"],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: String,
    coordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number]   // [longitude, latitude]
    }
  },
  deity: {
    type: String,
    required: true,
    enum: ['Shiva', 'Vishnu', 'Krishna', 'Durga', 'Lakshmi', 'Ganesha', 'Hanuman', 'Rama', 'Other']
  },
  historicalBackground: {
    type: String,
    required: true
  },
  significance: String,
  architecture: String,

  darshanTimings: [{
    day: String,
    morningOpen: String,
    morningClose: String,
    eveningOpen: String,
    eveningClose: String,
    note: String
  }],

  festivals: [{
    name: String,
    month: String,
    description: String,
    dateInfo: String   // e.g., "March-April (Chaitra Navratri)"
  }],

  visitorGuidelines: {
    dressCode: String,
    rules: [String],
    photographyAllowed: Boolean,
    entryFee: String
  },

  images: [{
    url: String,
    caption: String
  }],

  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  featured:{
   type:Boolean,
   default:false
  },
  facilities:{
   accommodation:[String],
   transport:[String],
   parking:Boolean,
   foodAvailable:Boolean
},
rituals:[{
   name:String,
   timing:String,
   description:String
}],
}, { 
  timestamps: true 
});

// Pre-save hook for slug
// Use synchronous middleware style so Mongoose does not require a callback.
templeSchema.pre('save', function() {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
});

templeSchema.index({
   name:"text",
   historicalBackground:"text",
   significance:"text"
});

const Temple = mongoose.model('Temple', templeSchema);

export default Temple;