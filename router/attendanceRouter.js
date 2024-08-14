import express from "express";
import {
  attendanceGet,
  attendancePost,
  attendanceGetAll,
  attendanceGetDelete,
  attendancePut,
  attendanceDefaultPut,
  attendanceInExcelGet,
  attendanceInExcelBranchGet,
  attendanceInExcelStudentsGet,
  attendanceTakeAttendanceGet,
} from "../controllers/attendanceController.js";
const router = express.Router();
import { auth } from "../middleware/auth.js";
router.get("/:id", attendanceGet);

router.post("/", attendancePost);
router.get("/", attendanceGetAll);
router.delete("/:id", attendanceGetDelete);
router.put("/:id", attendancePut);
router.post("/default", auth, attendanceDefaultPut);
router.get("/take/attendance", auth, attendanceTakeAttendanceGet);

router.get("/attendance/export", attendanceInExcelGet);
router.get("/attendance/export/:branch", attendanceInExcelBranchGet);
router.get("/attendance/export/students/:id", attendanceInExcelStudentsGet);

export default router;
