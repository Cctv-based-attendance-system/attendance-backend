import { Subject } from "../model/subjectsSchema.js";

const subjectGet = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: true,
        message: "subject Not Found",
        subject,
      });
    }
    res.status(200).json({
      success: true,
      message: "subject get successfully",
      subject,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const subjectPost = async (req, res) => {
  try {
    const { subjectName, createdBy, semester, branch } = req.body;
    if (!subjectName) {
      return res.status(404).json({
        success: false,
        message: "subject name is missing",
      });
    }
    if (!createdBy) {
      return res.status(404).json({
        success: false,
        message: "createdBy is missing",
      });
    }
    if (!semester) {
      return res.status(404).json({
        success: false,
        message: "semester is missing",
      });
    }
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "branch is missing",
      });
    }
    const subject = await Subject.create({
      subjectName,
      createdBy,
      semester,
      branch,
    });
    res.status(201).json({
      success: true,
      message: "subject is created successfully",
      subject,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const subjectGetAll = async (req, res) => {
  try {
    const subject = await Subject.find();
    res.status(200).json({
      success: true,
      message: "subject get successfully",
      subject,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const subjectPut = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const subjectGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({
        success: true,
        message: "subject Not Found",
        subject,
      });
    }
    res.status(200).json({
      success: true,
      message: "subject deleted successfully",
      subject,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

export { subjectGet, subjectPost, subjectGetAll, subjectPut, subjectGetDelete };
