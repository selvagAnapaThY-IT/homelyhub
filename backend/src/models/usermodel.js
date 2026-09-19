import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    // ==================== NAME ====================
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: [40, "Name should not be more than 40 characters"],
    },

    // ==================== EMAIL ====================
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    // ==================== PASSWORD ====================
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password should be at least 6 characters"],
      select: false,
    },

    // ==================== PASSWORD CONFIRMATION ====================
    passwordconfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },

    // ==================== PHONE NUMBER ====================
    phonenumber: {
      type: String,
      required: [true, "Please provide your phone number"],
      unique: true,
      trim: true,
    },

    // ==================== ROLE ====================
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ==================== AVATAR ====================
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },

    // ==================== PASSWORD CHANGE ====================
    passwordchangeat: {
      type: Date,
    },

    // ==================== PASSWORD RESET ====================
    passwordresetToken: {
      type: String,
      select: false,
      index: true,
    },

    passwordresetTokenExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);


// ======================================================
// REMOVE SENSITIVE DATA FROM JSON RESPONSE
// ======================================================

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.passwordconfirm;
    delete ret.passwordresetToken;
    delete ret.passwordresetTokenExpire;
    delete ret.passwordchangeat;
    delete ret.__v;

    return ret;
  },
});


// ======================================================
// HASH PASSWORD BEFORE SAVE
// ======================================================

userSchema.pre("save", async function (next) {
  // Only hash password when it is modified
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  // Don't store password confirmation
  this.passwordconfirm = undefined;

  ;
});


// ======================================================
// COMPARE PASSWORD
// ======================================================

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword || this.password);
};


// ======================================================
// CHECK PASSWORD CHANGED AFTER JWT
// ======================================================

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordchangeat) {
    const changedTimestamp = parseInt(
      this.passwordchangeat.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};


// ======================================================
// CREATE PASSWORD RESET TOKEN
// ======================================================

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordresetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordresetTokenExpire =
    Date.now() + 10 * 60 * 1000;

  return resetToken;
};


// ======================================================
// CREATE MODEL
// ======================================================

const User = mongoose.model("User", userSchema);

export { User };