const AccountActivity = require('../models/AccountActivity');
const User = require('../models/User');

exports.logActivity = async (req, res) => {
  try {
    const { userId, panel, activity } = req.body;

    const newLog = await AccountActivity.create({
      userId,
      panel,
      activity
    });

    res.status(201).json({
      status: true,
      message: "Activity logged",
      data: newLog
    });

  } catch (error) {
    console.error("Log activity error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getAdminActivities = async (req, res) => {
  try {
    const search = req.query.search || "";

    // Step 1: Fetch only admin users
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map(user => user._id);

    // Step 2: Filter activity logs by admin userIds (and optional search)
    const filter = {
      userId: { $in: adminUserIds }
    };

    if (search) {
      filter.activity = { $regex: search, $options: 'i' };
    }

    const activities = await AccountActivity.find(filter)
      .populate("userId", "name email role") // ✨ Bring in user info
      .sort({ timestamp: -1 })
      .limit(30); // Can increase if you add 'show all'

    // Step 3: Group by date
    const grouped = {};
    activities.forEach((item) => {
      const dateKey = item.timestamp.toLocaleDateString('en-GB', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      });

      if (!grouped[dateKey]) grouped[dateKey] = [];

      grouped[dateKey].push({
        time: item.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        action: `${item.panel} - ${item.activity}`,
        user: {
          name: item.userId?.name || "N/A",
          email: item.userId?.email || "",
          role: item.userId?.role || ""
        }
      });
    });

    return res.status(200).json({
      status: true,
      total: activities.length,
      grouped
    });

  } catch (error) {
    console.error("Activity Fetch Error:", error);
    return res.status(500).json({ status: false, message: "Server Error", error: error.message });
  }
};
