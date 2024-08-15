import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    // console.log("user", req.user);
    next();
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      e,
    });
  }
};
