const BookAppointment = require('../models/BookAppoitment');  // Correct model for appointments
const Review = require('../models/Review');  // Correct model for reviews
//const User = require('../models/User');  // Correct model for user

exports.getAdminDashboardData = async (req, res) => {
  try {
    // Fetch all appointments (no userId filtering)
    const appointments = await BookAppointment.find({});  // Fetch all appointments

    const totalAppointments = appointments.length;

    // Revenue (sum of paid appointment amounts)
    const totalRevenue = appointments
      .filter(appointment => appointment.status === 'Paid') // Assuming "Paid" status denotes paid appointments
      .reduce((total, appointment) => total + appointment.amount, 0);

    // Average Rating (Across all reviews, not specific to a user)
    const averageRatingData = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const avgRating = averageRatingData[0]?.avgRating || 0;  // Default to 0 if no reviews

    // Recent Activity (Top 3 recent appointments)
    const recentActivity = appointments
      .slice(0, 3)
      .map((appointment) => ({
        type: appointment.serviceType,
        description: `${appointment.serviceType}`,
        date: appointment.date,
      }));

    // Notifications
    const notifications = [];

    // MOT Test Due Soon Notification
    const motDueSoon = appointments.filter((appointment) => {
      const motDueDate = appointment.vehicle.lastMotDate;
      const diffInDays = (new Date(motDueDate) - new Date()) / (1000 * 3600 * 24);
      return diffInDays <= 14 && diffInDays >= 0;  // MOT Test due within the next 14 days
    });

    if (motDueSoon.length > 0) {
      notifications.push({
        type: 'MOT Test Soon',
        message: `You have ${motDueSoon.length} vehicles with MOT tests due in the next 14 days.`,
      });
    }

    // New Resource Notification
    notifications.push({
      type: 'New Resource Available',
      message: 'Download our latest vehicle maintenance guide.',
    });

    // Review Request Notification
    notifications.push({
      type: 'Review Request',
      message: 'Ask your recent customers to share their service experience.',
    });

    // Recent Bookings (Top 3 latest)
    const recentBookings = appointments
      .slice(0, 3)
      .map((appointment) => ({
        service: appointment.serviceType,
        vehicle: appointment.vehicle.model,
        date: appointment.date,
        amount: appointment.amount, // Just the raw amount, no formatting
      }));

    // Latest Reviews (Top 3 latest)
    const latestReviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(3);

    // Map over the reviews to create a simplified response
    const mappedReviews = latestReviews.map((review) => ({
      service: review.serviceType,
      rating: review.rating,
      comment: review.comment,
    }));

    // Dashboard Data to return
    const dashboardData = {
      welcomeMessage: `Welcome Back, Admin`,  // Just a placeholder for now
      totalAppointments,
      revenue: totalRevenue, // Plain number, no currency formatting
      averageRating: avgRating.toFixed(1), // Return the average rating, rounded to 1 decimal place
     // recentActivity,
      notifications,
      recentBookings,
      latestReviews: mappedReviews,
    };

    res.status(200).json({
      status: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while fetching dashboard data.',
      error: error.message,
    });
  }
};
