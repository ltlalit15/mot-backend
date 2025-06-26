const ClosedDay = require('../models/ClosedDay');


// 🔹 Create a closed day
exports.createClosedDay = async (req, res) => {
  try {
    const { day, month, year, reason, startDate, endDate, isImportant } = req.body;

    const newClosedDay = await ClosedDay.create({
      day,
      month,
      year,
      reason,
      startDate,
      endDate,
      isImportant
    });

    res.status(201).json({ status: true, data: newClosedDay });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// 🔹 Get all closed days
exports.getAllClosedDays = async (req, res) => {
  try {
    const closedDays = await ClosedDay.find().sort({ startDate: 1 });
    res.status(200).json({ status: true, data: closedDays });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// 🔹 Update a closed day
exports.updateClosedDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, month, year, reason, startDate, endDate, isImportant } = req.body;

    const updated = await ClosedDay.findByIdAndUpdate(
      id,
      { day, month, year, reason, startDate, endDate, isImportant },
      { new: true }
    );

    if (!updated) return res.status(404).json({ status: false, message: "Closed day not found" });

    res.status(200).json({ status: true, data: updated });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message });
  }
};

// 🔹 Delete a closed day (only if not important)
exports.deleteClosedDay = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedClosedDay = await ClosedDay.findByIdAndDelete(id);

    if (!deletedClosedDay) {
      return res.status(404).json({
        status: false,
        message: "closedday not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "ClosedDay deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting closedday:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};
