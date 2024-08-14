import mongoose from "mongoose";
const semesterSchema = new mongoose.Schema(
  {
    semesterName: {
      type: Number,
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
    CreatedAtAddress: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Semester = mongoose.model("Semester", semesterSchema);
