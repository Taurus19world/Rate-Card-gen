import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    name: String,
    country: String,
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'ZAR', 'CAD', 'AUD']
    },
    avatar: String
  },
  socialAccounts: [{
    platform: {
      type: String,
      enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'facebook']
    },
    username: String,
    followers: Number,
    engagementRate: Number,
    isConnected: {
      type: Boolean,
      default: false
    },
    accessToken: String,
    refreshToken: String,
    lastSync: Date
  }],
  rateCards: [{
    platform: String,
    campaignType: String,
    baseRate: Number,
    currency: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  ambassadorships: [{
    brandName: String,
    campaignDuration: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'completed', 'pending'],
      default: 'pending'
    },
    performanceStats: {
      impressions: Number,
      clicks: Number,
      conversions: Number,
      revenue: Number
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);