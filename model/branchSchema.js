import mongoose from "mongoose";
const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      unique: true,
    },
    updatedDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export const Branch = mongoose.model("Branch", branchSchema);
