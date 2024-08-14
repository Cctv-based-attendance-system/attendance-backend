import express from "express";
import {
  sessionGet,
  sessionPost,
  sessionGetAll,
  sessionGetDelete,
  sessionPut,
} from "../controllers/sessionController.js";
const router = express.Router();
router.get("/:id", sessionGet);
router.post("/", sessionPost);
router.get("/", sessionGetAll);
router.delete("/:id", sessionGetDelete);
router.put("/:id", sessionPut);

export default router;
