import { Attendance } from "../model/attendanceSchema.js";
import ExcelJS from "exceljs";
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
    const { session, semester, branch, subjects, student, status, takenBy } =
      req.body;

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "session is missing",
      });
    }
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "branch is missing",
      });
    }
    if (!takenBy) {
      return res.status(404).json({
        success: false,
        message: "takenBy is missing",
      });
    }
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "semester is missing",
      });
    }
    if (!subjects) {
      return res.status(404).json({
        success: false,
        message: "subjects is missing",
      });
    }
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "students is missing",
      });
    }
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "status is missing",
      });
    }

    const attendance = await Attendance.create({
      session,
      semester,
      branch,
      subjects,
      student,
      status,
      takenBy,
    });
    res.status(201).json({
      success: true,
      message: "attendance is created successfully",
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
  } catch (e) {
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
        error: e,
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
    console.log(user);
    const currentStudents = await User.find({
      userSession: user.defaultSubjectOfTeacher.session,
      userSemester: user.defaultSubjectOfTeacher.semester,
      userBranch: user.defaultSubjectOfTeacher.branch,
    });
    //   .populate("session")
    //   .populate("semester")
    //   .populate("branch");
    const subject = await Subject.findOne({
      _id: user.defaultSubjectOfTeacher.subject,
    });
    res.status(200).json({
      success: true,
      message: "default session set",
      attendanceStudents: currentStudents,
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
};
