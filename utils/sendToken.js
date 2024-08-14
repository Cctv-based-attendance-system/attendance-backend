import { sendEmail } from "./sendEmail.js";

export const sendToken = (
  res,
  user,
  message,
  statusCode = 201,
  req,
  apiType = "registrations"
) => {
  const token = user.getJWTToken();

  if (apiType === "registrations") {
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
    } = req.body;

    let userRoleDerived = "";
    if (userRole === "end-user") {
      userRoleDerived = "student Registrations";
    } else if (userRole === "teacher") {
      userRoleDerived = "Teacher Registrations";
    } else if (userRole === "hod") {
      userRoleDerived = "HOD Registrations";
    } else {
      userRoleDerived = "student Verifications";
    }

    const role = userRole ? userRole : "end-user";
    if (role !== "end-user") {
      if (token) {
        const templateVars = {
          btn: "Login",

          userEmail,
          password,
          userName,
          userRoleDerived: userRoleDerived?.split(" ")[0],
        };
        sendEmail(userEmail, userRoleDerived, "userRegestration", templateVars);
      }
    } else {
      const templateVars = {
        userName,
        verifyUrl: `${process.env.BACKEND_URL}/api/v1/user/verify/${user?._id}`,
      };

      sendEmail(
        userEmail,
        userRoleDerived,
        "accountVerifications",
        templateVars
      );
    }
  }

  res.status(statusCode).send({
    success: true,
    message,
    user,
    token,
  });
};
