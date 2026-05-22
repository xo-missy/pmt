const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);

// FIXED: simple wrapper instead of fragile Proxy
const User = {
  findOne(...args) {
    if (global.useLocalDB) return require('./localDb').User.findOne(...args);
    return MongooseUser.findOne(...args);
  },
  create(...args) {
    if (global.useLocalDB) return require('./localDb').User.create(...args);
    return MongooseUser.create(...args);
  },
};

module.exports = User;