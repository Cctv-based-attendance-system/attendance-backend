import express from "express";
import {
  branchGet,
  branchPost,
  branchGetAll,
  branchGetDelete,
  branchPut,
} from "../controllers/branchController.js";
const router = express.Router();
router.get("/:id", branchGet);
router.post("/", branchPost);
router.get("/", branchGetAll);
router.delete("/:id", branchGetDelete);
router.put("/:id", branchPut);

export default router;
