const Calendar = require("../models/bookingCalendar");  

exports.createCalendarBook = async (req, res) => {
  try {
    const calendar = new Calendar(req.body);
    console.log("Saving calendar:", calendar);
    await calendar.save();

    res.status(201).json({
      status: true,
      message: "Calendar created successfully",
      data: calendar
    });
  } catch (error) {
    console.error("Error creating calendar:", error);
    res.status(400).json({
      status: false,
      message: "Failed to create calendar",
      error: error.message
    });
  }
};

exports.getCalendarBook = async (req, res) => {
  try {
    const calendar = await Calendar.find();
    res.json({
      status: true,
      data: calendar
    });
  } catch (error) {
    console.error("Error fetching garage:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch garage",
      error: error.message
    });
  }
};


exports.updateBookCalendar = async (req, res) => {
  try {
    const { Id } = req.params;  // Access clientId as Id
    const updateBookCalendar = await Calendar.findByIdAndUpdate(
      Id, 
      { $set: req.body }, 
      { new: true }
    );

    if (!updateBookCalendar) {
      return res.status(404).json({
        status: false,
        message: "Calendar not found",
      });
    }

    res.json({
      status: true,
      message: "Calendar updated successfully",
      data: updateBookCalendar,
    });
  } catch (error) {
    console.error("Error updating calendar:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update calendar",
      error: error.message,
    });
  }
};

// Delete Client
exports.deleteBookCalendar = async (req, res) => {
  try {
    const { Id } = req.params;  // Access clientId as Id
    const deleteBookCalendar = await Bookclient.findByIdAndDelete(Id);

    if (!deleteBookCalendar) {
      return res.status(404).json({
        status: false,
        message: "Booking  not found",
      });
    }

    res.json({
      status: true,
      message: "Booking  deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Booking:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete Bokking",
      error: error.message,
    });
  }
};