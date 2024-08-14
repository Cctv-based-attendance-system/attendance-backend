import { userValidations } from "../helperValidations/userValidations.js";
import { User } from "../model/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";

const userGet = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user get successfully",
      user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const userPost = async (req, res) => {
  try {
    const {
      userName,
      userPhone,
      userEmail,
      userRegNo,
      userDepartment,
      userAssignSubject,
      userSession,
      userSemester,
      userRole,
      createdBy,
      addressAtCreated,
      password,
      userBranch,
    } = req.body;

    const message = userValidations(req);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: message.message,
      });
    }
    const IsUser = await User.findOne({ userEmail });
    if (IsUser) {
      return res.status(202).json({
        success: false,
        message: "email already exist",
      });
    }
    const accountTypeIsActive =
      userRole === "teacher" || userRole === "hod" ? "active" : "pending";
    const user = await User.create({
      userName,
      userPhone,
      userEmail,
      userRegNo,
      userDepartment,
      userAssignSubject,
      userSession,
      userSemester,
      userRole,
      createdBy,
      addressAtCreated,
      password,
      userBranch,
      accountActive: accountTypeIsActive,
      passwordUser:
        userRole === "teacher" || userRole === "hod" ? "not" : password,
    });
    // console.log(user);

    sendToken(res, user, "Register successfully", 201, req);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const userVerifyPost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "something went wrong!",
      });
    }

    user.accountActive = "active";
    await user.save();
    const templateVars = {
      btn: "Soon",
      userEmail: user?.userEmail,
      password: user?.passwordUser,
      userName: user?.userName,
      userRoleDerived: "students",
    };
    sendEmail(
      user?.userEmail,
      "Students Registrations",
      "userRegestration",
      templateVars
    );

    res.redirect("/emailTemplate/accountActive.html");
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e.message,
    });
  }
};

const userLoginPost = async (req, res) => {
  try {
    const { userEmail, userRegNo, password, type } = req.body;

    if (type === "end-user") {
      if (!userRegNo || !password) {
        return res.status(400).send({
          success: false,
          message: "Please enter all fields",
        });
      }
    } else {
      if (!userEmail || !password) {
        return res.status(400).send({
          success: false,
          message: "Please enter all fields",
        });
      }
    }

    if (type === "end-user") {
      const user = await User.findOne({ userRegNo }).select("+password");
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "incorrect password or Registration",
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "incorrect password or email",
        });
      }
      if (user?.accountActive !== "active") {
        const templateVars = {
          userName: user?.userName,
          verifyUrl: `${process.env.BACKEND_URL}/api/v1/user/verify/${user?._id}`,
        };

        sendEmail(
          user?.userName,
          "Account Verifications",
          "accountVerifications",
          templateVars
        );

        return res.status(404).json({
          success: false,
          message:
            "Please verify your email , verification link is sent to the email",
        });
      }
      sendToken(res, user, `Welcome back ${user.userName}`, 200, req, "login");
    } else {
      const user = await User.findOne({ userEmail }).select("+password");
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "incorrect password or email",
        });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).send({
          success: false,
          message: "incorrect password or email",
        });
      }

      sendToken(res, user, `Welcome back ${user.userName}`, 200, req, "login");
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const userGetAll = async (req, res) => {
  try {
    const user = await User.find({ userRole: "end-user" })
      .populate("userSession")
      .populate("userSemester")
      .populate("userBranch");

    res.status(200).json({
      success: true,
      message: "user get successfully",
      user,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const userPut = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const userGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const userCurrentGet = async (req, res) => {
  try {
    const { _id } = req?.user;
    const user = await User.findById(_id);
    const teacher = await User.findById(_id)
      .populate("userDepartment")
      .populate("userAssignSubject");

    if (user?.userRole !== "end-user") {
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "id not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "user data",
        user: teacher,
      });
    } else {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "id not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "user data",
        user,
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
const userTeacherGetAll = async (req, res) => {
  try {
    const teacher = await User.find({ userRole: { $ne: "end-user" } })
      .populate("userDepartment")
      .populate("userAssignSubject");

    res.status(200).json({
      success: true,
      message: "user get successfully",
      teacher,
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
  userGet,
  userPost,
  userGetAll,
  userPut,
  userGetDelete,
  userVerifyPost,
  userLoginPost,
  userCurrentGet,
  userTeacherGetAll,
};
