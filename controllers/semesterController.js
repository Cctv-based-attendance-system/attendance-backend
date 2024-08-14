import { Semester } from "../model/semsterSchema.js";

const semesterGet = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = await Semester.findById(id);
    if (!semester) {
      return res.status(404).json({
        success: true,
        message: "semester Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "semester get successfully",
      semester,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const semesterPost = async (req, res) => {
  try {
    const { semesterName, createdBy } = req.body;
    if (!semesterName) {
      return res.status(404).json({
        success: false,
        message: "semester name is missing",
      });
    }

    if (semesterName) {
      if (semesterName > 8) {
        return res.status(404).json({
          success: false,
          message: "semester should be 8 or less then that",
        });
      }
    }
    if (!createdBy) {
      return res.status(404).json({
        success: false,
        message: "createdBy is missing",
      });
    }
    const semester = await Semester.create({
      semesterName,
      createdBy,
    });
    res.status(201).json({
      success: true,
      message: "semester is created successfully",
      semester,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const semesterGetAll = async (req, res) => {
  try {
    const semester = await Semester.find();
    res.status(200).json({
      success: true,
      message: "semester get successfully",
      semester,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const semesterPut = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const semesterGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = await Semester.findById(id);
    if (!semester) {
      return res.status(404).json({
        success: true,
        message: "semester Not Found",
        semester,
      });
    }
    res.status(200).json({
      success: true,
      message: "semester deleted successfully",
      semester,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

export {
  semesterGet,
  semesterPost,
  semesterGetAll,
  semesterPut,
  semesterGetDelete,
};
