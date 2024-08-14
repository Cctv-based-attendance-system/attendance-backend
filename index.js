import express from "express";
import colors from "colors";
import { configDotenv } from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors";
import sessionRouter from "./router/sessionRouter.js";
import userRouter from "./router/userRouter.js";
import semesterRoute from "./router/semesterRoute.js";
import branchRoute from "./router/branchRoute.js";
import subjectRoute from "./router/subjectsRoute.js";
import attendanceRouter from "./router/attendanceRouter.js";

const app = express();

configDotenv({
  path: "./config/config.env",
});
connectDb();
app.use(cors());
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/semester", semesterRoute);
app.use("/api/v1/branch", branchRoute);
app.use("/api/v1/subject", subjectRoute);
app.use("/api/v1/attendance", attendanceRouter);

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to BEU Patna</h1>`);
});
app.listen(process.env.PORT, () => {
  console.log(`port is running at ${process.env.PORT}`.bgBlue.white);
});
