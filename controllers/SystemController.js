const BookAppointment = require('../models/BookAppoitment');
const Service = require('../models/service');

exports.getSystemData = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // --- This Month ---
    const totalJobsMonth = await BookAppointment.countDocuments({ createdAt: { $gte: startOfMonth } });
    const completedJobsMonth = await BookAppointment.countDocuments({ isCompleted: true, createdAt: { $gte: startOfMonth } });
    const motCompletedMonth = await BookAppointment.countDocuments({ isCompleted: true, serviceType: "MOT", createdAt: { $gte: startOfMonth } });
    const bookedOnlineMonth = await BookAppointment.countDocuments({ isBookedOnline: true, createdAt: { $gte: startOfMonth } });

    // --- All Time ---
    const totalJobs = await BookAppointment.countDocuments();
    const completedJobs = await BookAppointment.countDocuments({ isCompleted: true });
    const motCompleted = await BookAppointment.countDocuments({ isCompleted: true, serviceType: "MOT" });
    const bookedOnline = await BookAppointment.countDocuments({ isBookedOnline: true });

    // --- Stock Valuations ---
    const stockInvoiced = await Service.aggregate([
      { $match: { invoiced: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    const stockUninvoiced = await Service.aggregate([
      { $match: { invoiced: false } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);

    // --- Return Response ---
    return res.status(200).json({
      status: true,
      thisMonth: {
        totalJobs: totalJobsMonth,
        jobsCompleted: completedJobsMonth,
        motCompleted: motCompletedMonth,
        bookedOnline: bookedOnlineMonth
      },
      allTime: {
        totalJobs,
        jobsCompleted: completedJobs,
        motCompleted,
        bookedOnline
      },
    //   stockValuations: {
    //     stockInvoiced: stockInvoiced[0]?.total || 0,
    //     stockUninvoiced: stockUninvoiced[0]?.total || 0
    //   }
    });

  } catch (err) {
    console.error("❌ Error in dynamic summary:", err);
    return res.status(500).json({ status: false, message: "Server Error", error: err.message });
  }
};
