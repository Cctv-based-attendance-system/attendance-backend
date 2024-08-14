import express from "express";
import {
  userGet,
  userPost,
  userGetAll,
  userGetDelete,
  userPut,
  userVerifyPost,
  userLoginPost,
  userCurrentGet,
  userTeacherGetAll,
} from "../controllers/userController.js";
const router = express.Router();
import { auth } from "../middleware/auth.js";
router.get("/", auth, userGetAll);
router.get("/teacher", auth, userTeacherGetAll);

router.post("/", userPost);
router.post("/login", userLoginPost);

router.get("/verify/:id", userVerifyPost);

router.get("/:id", userGet);
router.delete("/:id", userGetDelete);
router.put("/:id", userPut);
router.get("/current/user", auth, userCurrentGet);

export default router;
