import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
    },
    userEmail: {
      type: String,
      unique: true,
    },
    userRegNo: {
      type: String,
    },
    userDepartment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    userAssignSubject: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    userSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    userSemester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },
    userBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    userRole: {
      type: String,
      enum: ["end-user", "teacher", "hod"],
      default: "end-user",
    },
    updatedDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    passwordUser: {
      type: String,
      default: "not",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addressAtCreated: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    accountActive: {
      type: String,
      enum: ["pending", "active", "not-active"],
      default: "pending",
    },
    password: {
      type: String,
      required: true,
    },
    defaultSubjectOfTeacher: {
      session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
      semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
      },
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  next();
});
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);
