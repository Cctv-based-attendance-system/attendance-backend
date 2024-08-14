import { Session } from "../model/sessionSchema.js";

const sessionGet = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: true,
        message: "session Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "session get successfully",
      session,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const sessionPost = async (req, res) => {
  try {
    const { sessionName, createdBy } = req.body;
    if (!sessionName) {
      return res.status(404).json({
        success: false,
        message: "session name is missing",
      });
    }
    if (!createdBy) {
      return res.status(404).json({
        success: false,
        message: "createdBy is missing",
      });
    }
    const session = await Session.create({
      sessionName,
      createdBy,
    });
    res.status(201).json({
      success: true,
      message: "session is created successfully",
      session,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const sessionGetAll = async (req, res) => {
  try {
    const session = await Session.find();
    res.status(200).json({
      success: true,
      message: "session get successfully",
      session,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const sessionPut = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const sessionGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: true,
        message: "session Not Found",
        session,
      });
    }
    res.status(200).json({
      success: true,
      message: "session deleted successfully",
      session,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

export { sessionGet, sessionPost, sessionGetAll, sessionPut, sessionGetDelete };
