import { Branch } from "../model/branchSchema.js";

const branchGet = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({
        success: true,
        message: "branch Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "branch get successfully",
      branch,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const branchPost = async (req, res) => {
  try {
    const { branchName, createdBy } = req.body;
    if (!branchName) {
      return res.status(404).json({
        success: false,
        message: "branch name is missing",
      });
    }
    if (!createdBy) {
      return res.status(404).json({
        success: false,
        message: "createdBy is missing",
      });
    }

    const IsBranch = await Branch.findOne({ branchName });

    if (IsBranch) {
      return res.status(400).json({
        success: false,
        message: "branch is already created",
      });
    }
    const branch = await Branch.create({
      branchName,
      createdBy,
    });
    res.status(201).json({
      success: true,
      message: "branch is created successfully",
      branch,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const branchGetAll = async (req, res) => {
  try {
    const branch = await Branch.find();
    res.status(200).json({
      success: true,
      message: "branch get successfully",
      branch,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

const branchPut = async (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};
const branchGetDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({
        success: true,
        message: "branch Not Found",
        branch,
      });
    }
    res.status(200).json({
      success: true,
      message: "branch deleted successfully",
      branch,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
      error: e,
    });
  }
};

export { branchGet, branchPost, branchGetAll, branchPut, branchGetDelete };
