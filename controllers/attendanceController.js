import { Attendance } from "../model/attendanceSchema.js";
import ExcelJS from "exceljs";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../model/userSchema.js";
import { Subject } from "../model/subjectsSchema.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const attendanceGet = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id)
      .populate("session")
      .populate("semester")
      .populate("branch")
      .populate("subjects")
      .populate("student")
      .populate("status")
      .populate("takenBy");
    if (!attendance) {
      return res.status(404).json({
        success: true,
        message: "attendance Not Found",
        attendance,
      });
    }
    res.status(200).json({
      success: true,
      message: "attendance get successfully",
      attendance,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendancePost = async (req, res) => {
  try {
    const { currentAttendance } = req.body;
    const currentTeacher = await User.findById(req?.user?._id);
    if (!currentTeacher) {
      // console.log(req?.user?._id);
      return res.status(404).json({
        success: false,
        message: "teacher id not found",
      });
    }
    const existAttendance = await Attendance.findOne({
      session: currentTeacher.defaultSubjectOfTeacher.session,
      semester: currentTeacher.defaultSubjectOfTeacher.semester,
      branch: currentTeacher.defaultSubjectOfTeacher.branch,
      subjects: currentTeacher.defaultSubjectOfTeacher.subject,
      date: new Date().toLocaleDateString(),
    });
    if (existAttendance) {
      return res.status(404).json({
        success: false,
        message: "attendance is already created",
        existAttendance,
      });
    }
    let attendance = await Attendance.create({
      session: currentTeacher.defaultSubjectOfTeacher.session,
      semester: currentTeacher.defaultSubjectOfTeacher.semester,
      branch: currentTeacher.defaultSubjectOfTeacher.branch,
      subjects: currentTeacher.defaultSubjectOfTeacher.subject,
      attendanceRecords: currentAttendance,
      takenBy: req?.user?._id,
      date: new Date().toLocaleDateString(),
    });

    const infoAtt = await attendance?.populate("attendanceRecords.student");

    if (infoAtt) {
      const info = infoAtt?.attendanceRecords?.map((e) => {
        return { ...e.toObject() };
      });

      const infoNext = info?.map((e) => {
        let students = e?.student;

        return { ...students, status: e?.status };
      });
      const subject = await Subject.findOne({
        _id: currentTeacher.defaultSubjectOfTeacher.subject,
      });
      return res.status(200).json({
        success: true,
        message: "default session set",
        attendanceStudents: infoNext,
        subject,
        id: attendance?._id,
      });
    }
    // console.log(info);

    // res.status(201).json({
    //   success: true,
    //   message: "attendance is created successfully",
    //   attendance,
    // });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceGetAll = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("session")
      .populate("semester")
      .populate("branch")
      .populate("subjects")
      .populate("student")
      .populate("status")
      .populate("takenBy");
    res.status(200).json({
      success: true,
      message: "attendance get successfully",
      attendance,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const attendancePut = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentAttendance } = req.body;
    const studentAttendance = await Attendance.findById(id);
    if (!studentAttendance) {
      res.status(500).json({
        success: false,
        message: "attendance id not found",
      });
    }

    const teacher = await User.findById(req.user?._id);
    if (!teacher) {
      res.status(500).json({
        success: false,
        message: "attendance id not found",
      });
    }

    studentAttendance.attendanceRecords = currentAttendance;
    await studentAttendance.save();

    const infoAtt = await studentAttendance?.populate(
      "attendanceRecords.student"
    );

    if (infoAtt) {
      const info = infoAtt?.attendanceRecords?.map((e) => {
        return { ...e.toObject() };
      });

      const infoNext = info?.map((e) => {
        let students = e?.student;

        return { ...students, status: e?.status };
      });
      const subject = await Subject.findOne({
        _id: teacher.defaultSubjectOfTeacher.subject,
      });
      return res.status(200).json({
        success: true,
        message: "default session set",
        attendanceStudents: infoNext,
        subject,
        id: id,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceDefaultPut = async (req, res) => {
  try {
    const { session, semester, branch, subject } = req.body;
    console.log(req.body);
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (session !== undefined) user.defaultSubjectOfTeacher.session = session;
    if (semester !== undefined)
      user.defaultSubjectOfTeacher.semester = semester;
    if (branch !== undefined) user.defaultSubjectOfTeacher.branch = branch;
    if (subject !== undefined) user.defaultSubjectOfTeacher.subject = subject;

    await user.save();

    res.status(200).json({
      success: true,
      message: "default session set",
      attendanceStudents: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const attendanceTakeAttendanceGet = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    // console.log(user);

    const existAttendance = await Attendance.findOne({
      session: user.defaultSubjectOfTeacher.session,
      semester: user.defaultSubjectOfTeacher.semester,
      branch: user.defaultSubjectOfTeacher.branch,
      subjects: user.defaultSubjectOfTeacher.subject,
      date: new Date().toLocaleDateString(),
    }).populate("attendanceRecords.student");
    const currentStudents = await User.find({
      userSession: user.defaultSubjectOfTeacher.session,
      userSemester: user.defaultSubjectOfTeacher.semester,
      userBranch: user.defaultSubjectOfTeacher.branch,
    });

    const subject = await Subject.findOne({
      _id: user.defaultSubjectOfTeacher.subject,
    });

    // console.log(infoNext);
    if (existAttendance) {
      const info = existAttendance?.attendanceRecords?.map((e) => {
        return { ...e.toObject() };
      });

      const infoNext = info?.map((e) => {
        let students = e?.student;

        return { ...students, status: e?.status };
      });

      return res.status(200).json({
        success: true,
        message: "default session set",
        attendanceStudents: infoNext,
        subject,
        id: existAttendance?._id,
      });
    }
    res.status(200).json({
      success: true,
      message: "default session set",
      attendanceStudents: currentStudents.map((student) => ({
        ...student.toObject(),
        status: "present",
      })),
      subject,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return res.status(404).json({
        success: true,
        message: "attendance Not Found",
        attendance,
      });
    }
    res.status(200).json({
      success: true,
      message: "attendance deleted successfully",
      attendance,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const attendanceAttendanceGet = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user Not Found",
      });
    }

    // console.log(user);
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "subject Not Found",
      });
    }
    const attendance = await Attendance.find({
      session: user?.userSession,
      semester: user?.userSemester,
      branch: user?.userBranch,
      subjects: subjectId,
    }).populate("attendanceRecords.student");
    // console.log(attendance);

    if (!attendance) {
      return res.status(404).json({
        success: true,
        message: "attendance Not Found",
        attendance: "",
      });
    }
    const infoAtt = attendance?.map((s) => {
      const students = s.attendanceRecords.filter((a) => {
        return a?.student?._id.equals(new mongoose.Types.ObjectId(userId));
      });
      const attendance = students[0].status;
      // console.log(attendance);
      return {
        date: s?.date,
        status: attendance,
        name: user?.userName,
        email: user?.userEmail,
        phone: user?.userPhone,
        regNo: user?.userRegNo,
      };
    });
    console.log(infoAtt);
    // const infoAtt2 = infoAtt?.map((s) => {
    //   return {
    //     date: s?.date,
    //     attendanceRecords: students,
    //   };
    // });

    res.status(200).json({
      success: true,
      message: "attendance deleted successfully",
      attendance: infoAtt,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceAttendanceBranchGet = async (req, res) => {
  try {
    const { semester, branch, session } = req.params;

    const attendance = await Attendance.find({
      session: session,
      semester: semester,
      branch: branch,
    }).populate("attendanceRecords.student");

    if (!attendance) {
      return res.status(404).json({
        success: true,
        message: "attendance Not Found",
      });
    }
    const user = await User.find({
      userSession: session,
      userSemester: semester,
      userBranch: branch,
    });
    // console.log(attendance);
    const info = user?.map((u) => {
      let present = 0;

      const infoAtt = attendance?.map((s) => {
        const students = s.attendanceRecords.find((a) => {
          console.log(a?.student?._id, u?._id);
          //  return a?.student?._id.equals(new mongoose.Types.ObjectId(userId));
          return a?.student?._id === u?._id;
        });
        // const attendance = students.status;
        console.log(students);
        // return {
        //   date: s?.date,
        //   status: attendance,
        //   name: user?.userName,
        //   email: user?.userEmail,
        //   phone: user?.userPhone,
        //   regNo: user?.userRegNo,
        // };
      });
      // console.log(infoAtt);
      // attendance.forEach((a) => {
      //   if (a?._id === u?._id) {
      //   }
      // });
    });
    // const infoAtt = attendance?.map((s) => {
    //   const students = s.attendanceRecords.filter((a) => {
    //     // console.log("user", userId);
    //     // console.log("student", a?.student?._id);
    //     // console.log(
    //     //   "student",
    //     //   a?.student?._id.equals(new mongoose.Types.ObjectId(userId))
    //     // );

    //     return a?.student?._id.equals(new mongoose.Types.ObjectId(userId));
    //   });
    //   const attendance = students[0].status;
    //   // console.log(attendance);
    //   return {
    //     date: s?.date,
    //     status: attendance,
    //     name: user?.userName,
    //     email: user?.userEmail,
    //     phone: user?.userPhone,
    //     regNo: user?.userRegNo,
    //   };
    // });
    // console.log(infoAtt);
    // const infoAtt2 = infoAtt?.map((s) => {
    //   return {
    //     date: s?.date,
    //     attendanceRecords: students,
    //   };
    // });

    res.status(200).json({
      success: true,
      message: "attendance deleted successfully",
      attendance: user,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceInExcelGet = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({})
      .populate("session")
      .populate("semester")
      .populate("branch")
      .populate("subjects")
      .populate("student")
      .populate("status")
      .populate("takenBy");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.addRow([
      "Session",
      "Semester",
      "Branch",
      "Subjects",
      "Student",
      "Taken By",
      "Created At",
      "Updated At",
      "Attendance",
    ]);
    sheet.columns = [
      { header: "Session", key: "session", width: 20 },
      { header: "Semester", key: "semester", width: 20 },
      { header: "Branch", key: "branch", width: 20 },
      { header: "Subjects", key: "subjects", width: 40 },
      { header: "Student", key: "student", width: 40 },

      { header: "Taken By", key: "takenBy", width: 40 },
      { header: "Created At", key: "createdAt", width: 45 },
      { header: "Updated At", key: "updatedAt", width: 45 },
      { header: "Attendance", key: "status", width: 30 },
    ];

    attendanceRecords.forEach((record) => {
      sheet.addRow([
        record.session.sessionName,
        record.semester.semesterName,
        record.branch.branchName,
        record.subjects.subjectName,
        record.student.userName,

        record.takenBy.userName,
        new Date(record.createdAt).toDateString(),
        new Date(record.updatedAt).toDateString(),
        record.status,
      ]);
    });

    const filePath = path.join(
      __dirname,
      "../static/emailTemplate/",
      "attendance_data.xlsx"
    );

    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "attendance_data.xlsx", (err) => {
      if (err) {
        console.error("Error serving file:", err);
        res.status(500).send("Error downloading file");
      }

      fs.unlinkSync(filePath);
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const attendanceInExcelBranchGet = async (req, res) => {
  const { branch } = req.params;
  try {
    const attendanceRecords = await Attendance.find({ branch })
      .populate("session")
      .populate("semester")
      .populate("subjects")
      .populate("student")
      .populate("status")
      .populate("takenBy");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.addRow([
      "Session",
      "Semester",

      "Subjects",
      "Student",
      "Taken By",
      "Created At",
      "Updated At",
      "Attendance",
    ]);
    sheet.columns = [
      { header: "Session", key: "session", width: 20 },
      { header: "Semester", key: "semester", width: 20 },

      { header: "Subjects", key: "subjects", width: 40 },
      { header: "Student", key: "student", width: 40 },

      { header: "Taken By", key: "takenBy", width: 40 },
      { header: "Created At", key: "createdAt", width: 45 },
      { header: "Updated At", key: "updatedAt", width: 45 },
      { header: "Attendance", key: "status", width: 30 },
    ];

    attendanceRecords.forEach((record) => {
      sheet.addRow([
        record.session.sessionName,
        record.semester.semesterName,

        record.subjects.subjectName,
        record.student.userName,

        record.takenBy.userName,
        new Date(record.createdAt).toDateString(),
        new Date(record.updatedAt).toDateString(),
        record.status,
      ]);
    });

    const filePath = path.join(
      __dirname,
      "../static/emailTemplate/",
      `attendance_data.xlsx`
    );

    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, "attendance_data.xlsx", (err) => {
      if (err) {
        console.error("Error serving file:", err);
        res.status(500).send("Error downloading file");
      }

      fs.unlinkSync(filePath);
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const attendanceInExcelStudentsGet = async (req, res) => {
  try {
    const { id } = req.params;
    const userAttendance = await Attendance.find({ student: id })
      .populate("subjects")
      .populate("student")
      .populate("status")
      .populate("semester")
      .populate("takenBy");

    if (!userAttendance) {
      return res.status(404).json({
        success: false,
        message: "not found",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.addRow([
      "Subjects",
      "Semester",
      "Taken By",
      "Created At",
      "Updated At",
      "Attendance",
    ]);
    sheet.columns = [
      { header: "Subjects", key: "subjects", width: 40 },
      { header: "Semester", key: "semester", width: 20 },

      { header: "Taken By", key: "takenBy", width: 40 },
      { header: "Created At", key: "createdAt", width: 45 },
      { header: "Updated At", key: "updatedAt", width: 45 },
      { header: "Attendance", key: "status", width: 30 },
    ];

    userAttendance.forEach((record) => {
      sheet.addRow([
        record.subjects.subjectName,
        record.semester.semesterName,

        record.takenBy.userName,
        new Date(record.createdAt).toDateString(),
        new Date(record.updatedAt).toDateString(),
        record.status,
      ]);
    });
    const user = await User.findById(id);
    const filePath = path.join(
      __dirname,
      "../static/emailTemplate/",
      `attendance_${user?.userName}_data.xlsx`
    );

    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, `attendance_${user?.userName}_data.xlsx`, (err) => {
      if (err) {
        console.error("Error serving file:", err);
        res.status(500).send("Error downloading file");
      }

      fs.unlinkSync(filePath);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

export {
  attendanceGet,
  attendancePost,
  attendanceGetAll,
  attendancePut,
  attendanceDefaultPut,
  attendanceGetDelete,
  attendanceInExcelGet,
  attendanceInExcelBranchGet,
  attendanceInExcelStudentsGet,
  attendanceTakeAttendanceGet,
  attendanceAttendanceGet,
  attendanceAttendanceBranchGet,
};
