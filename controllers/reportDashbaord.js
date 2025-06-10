const mongoose = require('mongoose');
const BookAppointment = require('../models/BookAppoitment');
const Review = require('../models/Review');
const User = require('../models/User');

const getDateRange = (filterType, startDate, endDate) => {
  const now = new Date();
  let from, to;

  switch (filterType) {
    case 'today':
      from = new Date(now.setHours(0, 0, 0, 0));
      to = new Date();
      break;
    case 'thisWeek':
      const day = now.getDay();
      from = new Date(now.setDate(now.getDate() - day));
      from.setHours(0, 0, 0, 0);
      to = new Date();
      break;
    case 'thisMonth':
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date();
      break;
    case 'last30Days':
      from = new Date(now.setDate(now.getDate() - 30));
      to = new Date();
      break;
    case 'thisQuarter':
      const quarterStartMonth = now.getMonth() - (now.getMonth() % 3);
      from = new Date(now.getFullYear(), quarterStartMonth, 1);
      to = new Date();
      break;
    case 'thisYear':
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date();
      break;
    case 'custom':
      from = new Date(startDate);
      to = new Date(endDate);
      break;
    default:
      from = null;
      to = null;
  }
  return { from, to };
};

exports.getReportDashboardData = async (req, res) => {
  try {
    // Ensure that req.body is defined and contains the necessary data
    const { filterType = 'thisMonth', startDate, endDate } = req.body || {};

    // Handle the case where filterType might be missing
    if (!filterType) {
      return res.status(400).json({
        status: false,
        message: 'Missing required filterType.',
      });
    }

    const { from, to } = getDateRange(filterType, startDate, endDate);
    const dateFilter = from && to ? { createdAt: { $gte: from, $lte: to } } : {};

    const appointments = await BookAppointment.find(dateFilter);
    const reviews = await Review.find(dateFilter);
    const users = await User.find({ role: 'customer', ...dateFilter });

    const totalRevenue = appointments
      .filter(app => app.status === 'Paid')
      .reduce((sum, app) => sum + app.amount, 0);

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    const motAppointments = appointments.filter(app => app.serviceType === 'MOT');
    const motPass = motAppointments.filter(app => app.result === 'Pass').length;
    const motPassRate = motAppointments.length === 0 ? 0 : ((motPass / motAppointments.length) * 100).toFixed(1);

    const revenueByType = { MOT: 0, Repairs: 0, Services: 0 };
    appointments.forEach(app => {
      if (app.status === 'Paid' && revenueByType.hasOwnProperty(app.serviceType)) {
        revenueByType[app.serviceType] += app.amount;
      }
    });

    const avgServiceTime = (
      appointments.reduce((sum, app) => sum + (app.serviceDuration || 90), 0) /
      (appointments.length || 1)
    ).toFixed(1);

    const recentBookings = appointments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(app => ({
        service: app.serviceType,
        vehicle: app.vehicle?.model || 'N/A',
        date: app.date,
        amount: app.amount,
      }));

    const latestReviews = reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(review => ({
        service: review.serviceType,
        rating: review.rating,
        comment: review.comment,
      }));

    const motDueSoon = appointments.filter(app => {
      const motDueDate = app.vehicle?.lastMotDate;
      if (!motDueDate) return false;
      const diffInDays = (new Date(motDueDate) - new Date()) / (1000 * 3600 * 24);
      return diffInDays <= 14 && diffInDays >= 0;
    });

    const notifications = [
      ...(motDueSoon.length > 0
        ? [{
          type: 'MOT Test Soon',
          message: `You have ${motDueSoon.length} vehicles with MOT tests due in the next 14 days.`
        }] : []),
      {
        type: 'New Resource Available',
        message: 'Download our latest vehicle maintenance guide.'
      },
      {
        type: 'Review Request',
        message: 'Ask your recent customers to share their service experience.'
      }
    ];

    res.status(200).json({
      status: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        revenue: {
          current: totalRevenue,
          target: 30000,
          changePercent: 0 // Add historical comparison if needed
        },
        bookings: {
          count: appointments.length,
          changePercent: 0,
          completionRate: '92%',
          avgTime: '1.5h'
        },
        reviews: {
          count: reviews.length,
          changePercent: 0,
          average: avgRating.toFixed(1)
        },
        customers: {
          new: users.length,
          changePercent: 0
        },
        motTests: {
          total: motAppointments.length,
          changePercent: 0,
          passRate: `${motPassRate}%`
        },
        revenueOverview: revenueByType,
        avgServiceTime: {
          overall: `${avgServiceTime} min`,
          MOT: '45m',
          oilChange: '30m'
        },
        satisfaction: {
          rating: avgRating.toFixed(1),
          totalReviews: reviews.length
        },
        notifications,
        recentBookings,
        latestReviews
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while fetching dashboard data.',
      error: error.message
    });
  }
};
