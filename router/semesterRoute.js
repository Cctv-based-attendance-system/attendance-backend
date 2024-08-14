import express from "express";
import {
  semesterGet,
  semesterPost,
  semesterGetAll,
  semesterGetDelete,
  semesterPut,
} from "../controllers/semesterController.js";
const router = express.Router();
router.get("/:id", semesterGet);
router.post("/", semesterPost);
router.get("/", semesterGetAll);
router.delete("/:id", semesterGetDelete);
router.put("/:id", semesterPut);

export default router;
