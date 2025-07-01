const User = require("../models/User");
const BookAppointment = require("../models/BookAppoitment");
const Review = require("../models/Review");
const mongoose = require("mongoose");

exports.getDashboardData = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found.'
      });
    }

    // Fetch user appointments
    const userAppointments = await BookAppointment.find({ userId: userId });

    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'No appointments found for this user.'
      });
    }

    // Active Vehicles Count (assuming 1 appointment = 1 vehicle)
    const activeVehicles = userAppointments.length;

    // Past Services Count (only count appointments with total > 0)
    const pastServices = userAppointments.filter(appointment =>
      appointment?.bookingSummary?.costSummary?.total > 0
    ).length;

    // Reviews Given
    const reviewsGiven = await Review.countDocuments({
      userId: new mongoose.Types.ObjectId(userId)
    });

    // Recent Activities (latest 3 from appointments)
    const recentActivity = userAppointments
      .slice(0, 3)
      .map(appointment => {
        const total = appointment?.bookingSummary?.costSummary?.total || 0;
        return {
          date: appointment?.appointmentDetails?.selectedDate || null,
          type: total > 0 ? "Service" : "MOT Test",
          description: total > 0
            ? `Service completed - £${total}`
            : `MOT Test completed - £${total}`,
        };
      });

    // Resources Based on Activity
    const availableResources = [];

    if (pastServices > 0) {
      availableResources.push(
        {
          title: "Service Manual",
          url: "https://example.com/service-manual"
        },
        {
          title: "Vehicle Maintenance Guide",
          url: "https://example.com/vehicle-maintenance-guide"
        }
      );
    }

    // Check if any MOT is due within 45 days
    const motDueSoon = userAppointments.some(appointment => {
      const motDueDate = appointment?.vehicle?.lastMotDate;
      if (!motDueDate) return false;
      const diffInDays = (new Date(motDueDate) - new Date()) / (1000 * 3600 * 24);
      return diffInDays <= 45 && diffInDays >= 0;
    });

    if (motDueSoon) {
      availableResources.push(
        {
          title: "MOT Checklist",
          url: "https://example.com/mot-checklist"
        },
        {
          title: "Pre-MOT Inspection Guide",
          url: "https://example.com/pre-mot-guide"
        }
      );
    }

    // Notifications
    const notifications = [];

    if (!user.accountActivated) {
      notifications.push({
        title: "Account Reactivation",
        message: "Please complete the reactivation process to maintain full access to your account.",
        type: "alert"
      });
    }

    if (motDueSoon) {
      notifications.push({
        title: "MOT Due Soon",
        message: "Your MOT is due in 45 days.",
        type: "info"
      });
    }

    // Final Dashboard Response
    const dashboardData = {
      welcomeMessage: `Welcome Back, ${user.name}!`,
      activeVehicles,
      pastServices,
      reviewsGiven,
      recentActivity,
      notifications,
      availableResources
    };

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

