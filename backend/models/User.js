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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare plain password with hashed
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);

module.exports = new Proxy(MongooseUser, {
  get(target, prop) {
    if (global.useLocalDB) {
      return require('./localDb').User[prop];
    }
    return target[prop];
  },
  construct(target, args) {
    if (global.useLocalDB) {
      const LocalUserClass = require('./localDb').User;
      return new LocalUserClass(...args);
    }
    return new target(...args);
  }
});
