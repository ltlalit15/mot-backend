const Calendar = require("../models/bookingCalendar");

// Create a new calendar booking
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

// Get all calendar bookings
exports.getCalendarBook = async (req, res) => {
  try {
    const calendar = await Calendar.find();
    res.json({
      status: true,
      data: calendar
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch calendar",
      error: error.message
    });
  }
};

// Update a calendar booking by ID
exports.updateBookCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBookCalendar = await Calendar.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updateBookCalendar) {
      return res.status(404).json({
        status: false,
        message: "Calendar not found"
      });
    }

    res.json({
      status: true,
      message: "Calendar updated successfully",
      data: updateBookCalendar
    });
  } catch (error) {
    console.error("Error updating calendar:", error);
    res.status(400).json({
      status: false,
      message: "Failed to update calendar",
      error: error.message
    });
  }
};

// Delete a calendar booking by ID
exports.deleteBookCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBookCalendar = await Calendar.findByIdAndDelete(id);

    if (!deleteBookCalendar) {
      return res.status(404).json({
        status: false,
        message: "Booking not found"
      });
    }

    res.json({
      status: true,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete booking",
      error: error.message
    });
  }
};
