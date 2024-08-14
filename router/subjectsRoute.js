import express from "express";
import {
  subjectGet,
  subjectPost,
  subjectGetAll,
  subjectGetDelete,
  subjectPut,
} from "../controllers/subjectController.js";
const router = express.Router();
router.get("/:id", subjectGet);
router.post("/", subjectPost);
router.get("/", subjectGetAll);
router.delete("/:id", subjectGetDelete);
router.put("/:id", subjectPut);

export default router;
