import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema(
  {
    leaveSubject: {
      type: String,
      required: true,
    },
    leaveCause: {
      type: String,
      required: true,
    },
    updatedDateByUser: {
      type: Date,
    },
    updatedDateByTeacher: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedOrRejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addressAtWritten: {
      type: String,
    },
    addressAtWritten: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps }
);
export const Leave = mongoose.model("Leave", leaveSchema);
