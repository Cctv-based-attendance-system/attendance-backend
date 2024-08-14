export const userValidations = async (req) => {
  const {
    userName,
    userPhone,
    userEmail,
    password,
    userRegNo,
    userDepartment,
    userAssignSubject,
    userSession,
    userSemester,
    userRole,
    createdBy,
    addressAtCreated,
  } = req.body;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!userName) {
    return {
      success: false,
      message: "Name is missing",
    };
  }
  if (!userEmail) {
    return {
      success: false,
      message: "Email is missing",
    };
  }
  if (!password) {
    return {
      success: false,
      message: "Password is missing",
    };
  }

  if (password) {
    if (password.length > 5) {
      return {
        success: false,
        message: "Password length should be grater then 5",
      };
    }
  }

  if (!passwordPattern.test(password)) {
    return {
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }
  return {
    success: true,
    message: "all test case passed",
  };
};
