import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    subjects: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    attendanceRecords: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent"],
          default: "present",
        },
      },
    ],
    takenBy: {
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
  },
  { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);

// import mongoose from "mongoose";
// const attendanceSchema = new mongoose.Schema(
//   {
//     session: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Session",
//       required: true,
//     },
//     semester: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Semester",
//       required: true,
//     },
//     branch: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Branch",
//       required: true,
//     },
//     subjects: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: true,
//     },
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["present", "absent"],
//       default: "present",
//     },
//     updatedDate: {
//       type: Date,
//     },
//     takenBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     address: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );
// export const Attendance = mongoose.model("Attendance", attendanceSchema);
