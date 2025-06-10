const User = require("../models/User");
const BookAppointment = require("../models/BookAppoitment");
const Review = require("../models/Review");

exports.getDashboardData = async (req, res) => {
  const userId = req.params.userId;  // Get userId from the URL parameter

  try {
    // Fetch user details from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found.'
      });
    }

    // Fetch all BookAppointments associated with the userId
    const userAppointments = await BookAppointment.find({ "userId": userId });

    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No appointments found for this user.'
      });
    }

    // Active Vehicles Count (Count vehicles associated with this user)
    const activeVehicles = userAppointments.length;  // Assuming each appointment corresponds to a vehicle

    // Past Services Count (Count of completed services for the user)
    const pastServices = userAppointments.filter(appointment => 
      appointment.bookingSummary.costSummary.total > 0  // Completed services
    ).length;

    // Reviews Given (Count of reviews submitted by the user)
    const reviewsGiven = await Review.countDocuments({ "user": userId });

    // Recent Activity (Recent 3 activities: MOT Test, Services, or Reviews)
    const recentActivity = userAppointments.slice(0, 3).map(appointment => ({
      date: appointment.appointmentDetails.selectedDate,
      type: appointment.bookingSummary.costSummary.total > 0 ? "Service" : "MOT Test",
      description: appointment.bookingSummary.costSummary.total > 0
        ? `Service completed - £${appointment.bookingSummary.costSummary.total}`
        : `MOT Test completed - £${appointment.bookingSummary.costSummary.total}`,
    }));

    // Dynamically generate available resources based on user activity
    const availableResources = [];

    // Check if the user has completed a service recently
    if (pastServices > 0) {
      availableResources.push({
        title: "Service Manual",
        url: "https://example.com/service-manual"  // Link to service manual
      });
      availableResources.push({
        title: "Vehicle Maintenance Guide",
        url: "https://example.com/vehicle-maintenance-guide"  // Link to maintenance guide
      });
    }

    // Check if the user's MOT is due soon (within 45 days)
    const motDueSoon = userAppointments.some(appointment => {
      const motDueDate = appointment.vehicle.lastMotDate;
      const diffInDays = (new Date(motDueDate) - new Date()) / (1000 * 3600 * 24);
      return diffInDays <= 45 && diffInDays >= 0;
    });

    if (motDueSoon) {
      availableResources.push({
        title: "MOT Checklist",
        url: "https://example.com/mot-checklist"  // Link to MOT checklist
      });
      availableResources.push({
        title: "Pre-MOT Inspection Guide",
        url: "https://example.com/pre-mot-guide"  // Link to pre-MOT inspection guide
      });
    }

    // Example: Account Reactivation Notification
    const notifications = [];

    if (!user.accountActivated) {
      notifications.push({
        title: "Account Reactivation",
        message: "Please complete the reactivation process to maintain full access to your account.",
        type: "alert",
      });
    }

    // If MOT due soon, add a notification
    if (!user.motDueSoon) {
      notifications.push({
        title: "MOT Due Soon",
        message: "Your MOT is due in 45 days.",
        type: "info",
      });
    }

    // Construct the dashboard data to return
    const dashboardData = {
      welcomeMessage: `Welcome Back, ${user.name}!`,
      activeVehicles,
      pastServices,
      reviewsGiven,
      recentActivity,
      notifications,
      availableResources
    };

    // Return the dashboard data
    res.status(200).json({
      status: true,
      message: 'Retrieved Dashboard data successfully',
      data: dashboardData,
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching dashboard data.",
      error: error.message,
    });
  }
};
