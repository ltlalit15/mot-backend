const EmailTemplate = require('../models/EmailTemplate');

// 🔹 Create an email template
exports.createEmailTemplate = async (req, res) => {
  try {
    const { templateName, templateType, templateDescription, startingPoint } = req.body;

    const newTemplate = await EmailTemplate.create({
      templateName,
      templateType,
      templateDescription,
      startingPoint
    });

    res.status(201).json({ status: true, data: newTemplate });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// 🔹 Get all email templates
exports.getAllEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    res.status(200).json({ status: true, data: templates });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// 🔹 Update an email template
exports.updateEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { templateName, templateType, templateDescription, startingPoint } = req.body;

    const updatedTemplate = await EmailTemplate.findByIdAndUpdate(
      id,
      { templateName, templateType, templateDescription, startingPoint },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ status: false, message: "Template not found" });
    }

    res.status(200).json({ status: true, data: updatedTemplate });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// 🔹 Delete an email template
exports.deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTemplate = await EmailTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({
        status: false,
        message: "Email template not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Email template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting email template:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};
